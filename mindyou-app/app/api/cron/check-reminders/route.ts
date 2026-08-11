import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushToAll } from "@/lib/push";
import type { Reminder } from "@prisma/client";

const TIMEZONE = "Europe/Amsterdam";

function nowInAmsterdam() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("nl-NL", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const hhmm = `${get("hour")}:${get("minute")}`;
  const dateStamp = `${get("year")}-${get("month")}-${get("day")}`;

  // "short" weekday levert bv. "zo", "ma" — mappen naar 0..6 zoals in het datamodel.
  const weekdayMap: Record<string, number> = {
    zo: 0, ma: 1, di: 2, wo: 3, do: 4, vr: 5, za: 6,
  };
  const weekdayShort = get("weekday").toLowerCase().replace(".", "");
  const weekday = weekdayMap[weekdayShort] ?? now.getDay();

  return { hhmm, dateStamp, weekday };
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided =
    req.nextUrl.searchParams.get("secret") ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (secret && provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { hhmm, dateStamp, weekday } = nowInAmsterdam();
  const fireKey = `${dateStamp}T${hhmm}`;

  const candidates = await prisma.reminder.findMany({
    where: { active: true, time: hhmm },
  });

  const due = candidates.filter((r: Reminder) => {
    if (r.lastFiredKey === fireKey) return false; // al afgevuurd deze minuut
    if (r.repeat === "WEKELIJKS" && !r.weekdays.includes(weekday)) return false;
    return true;
  });

  let pushResult = { sent: 0, failed: 0, removed: 0 };
  for (const reminder of due) {
    try {
      pushResult = await sendPushToAll({ title: "MindYou", body: reminder.title });
    } catch {
      // VAPID-sleutels ontbreken oid — sla evengoed lastFiredKey niet over,
      // zodat we het bij de volgende cron-tick opnieuw proberen.
      continue;
    }

    await prisma.reminder.update({
      where: { id: reminder.id },
      data: {
        lastFiredKey: fireKey,
        ...(reminder.repeat === "EENMALIG" ? { active: false } : {}),
      },
    });
  }

  return NextResponse.json({
    checked: candidates.length,
    fired: due.length,
    time: hhmm,
    ...pushResult,
  });
}
