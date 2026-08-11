import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ICON_OPTIONS } from "@/lib/icons";
import type { IconSetting } from "@prisma/client";

export async function GET() {
  const existing = await prisma.iconSetting.findMany({ orderBy: { order: "asc" } });

  if (existing.length === 0) {
    const created = await prisma.$transaction(
      ICON_OPTIONS.map((opt, i) =>
        prisma.iconSetting.create({
          data: { key: opt.key, visible: opt.defaultVisible, order: i },
        })
      )
    );
    return NextResponse.json(created);
  }

  const missing = ICON_OPTIONS.filter(
    (opt) => !existing.some((e: IconSetting) => e.key === opt.key)
  );
  if (missing.length > 0) {
    const startOrder = existing.length;
    const added = await prisma.$transaction(
      missing.map((opt, i) =>
        prisma.iconSetting.create({
          data: { key: opt.key, visible: opt.defaultVisible, order: startOrder + i },
        })
      )
    );
    return NextResponse.json([...existing, ...added].sort((a, b) => a.order - b.order));
  }

  return NextResponse.json(existing);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { settings } = body as {
    settings?: { key: string; visible: boolean; order: number }[];
  };

  if (!settings || !Array.isArray(settings)) {
    return NextResponse.json({ error: "settings array verplicht" }, { status: 400 });
  }

  await prisma.$transaction(
    settings.map((s) =>
      prisma.iconSetting.update({
        where: { key: s.key },
        data: { visible: s.visible, order: s.order },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
