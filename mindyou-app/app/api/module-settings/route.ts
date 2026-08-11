import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MODULES } from "@/lib/modules";
import type { ModuleSetting } from "@prisma/client";

export async function GET() {
  const existing = await prisma.moduleSetting.findMany({ orderBy: { order: "asc" } });

  // Eerste keer: zet alle bekende modules aan, in de volgorde van de registry.
  if (existing.length === 0) {
    const created = await prisma.$transaction(
      MODULES.map((m, i) =>
        prisma.moduleSetting.create({ data: { key: m.key, visible: true, order: i } })
      )
    );
    return NextResponse.json(created);
  }

  // Nieuwe modules die nog niet in de database staan (bv. na een update) alsnog toevoegen.
  const missing = MODULES.filter((m) => !existing.some((e: ModuleSetting) => e.key === m.key));
  if (missing.length > 0) {
    const startOrder = existing.length;
    const added = await prisma.$transaction(
      missing.map((m, i) =>
        prisma.moduleSetting.create({
          data: { key: m.key, visible: true, order: startOrder + i },
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
      prisma.moduleSetting.update({
        where: { key: s.key },
        data: { visible: s.visible, order: s.order },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
