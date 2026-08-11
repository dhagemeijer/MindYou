import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import type { PushSubscription } from "@prisma/client";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error("VAPID-sleutels ontbreken (env vars niet gezet)");
  }
  webpush.setVapidDetails("mailto:noreply@mindyou.app", publicKey, privateKey);
  configured = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/** Stuurt een pushmelding naar alle opgeslagen abonnementen; ruimt verlopen
 * abonnementen (410/404) automatisch op. */
export async function sendPushToAll(payload: PushPayload) {
  ensureConfigured();
  const subs = await prisma.pushSubscription.findMany();
  const json = JSON.stringify(payload);

  const results = await Promise.allSettled(
    subs.map((sub: PushSubscription) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        json
      )
    )
  );

  const expiredIds: string[] = [];
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      const statusCode = (result.reason as { statusCode?: number })?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        expiredIds.push(subs[i].id);
      }
    }
  });

  if (expiredIds.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { id: { in: expiredIds } } });
  }

  return {
    sent: results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").length,
    removed: expiredIds.length,
  };
}
