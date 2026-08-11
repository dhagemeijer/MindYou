import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { steps } = body as { steps?: { id: string; order: number }[] };

  if (!steps || !Array.isArray(steps)) {
    return NextResponse.json({ error: "steps array verplicht" }, { status: 400 });
  }

  await prisma.$transaction(
    steps.map((s) =>
      prisma.routineStep.update({ where: { id: s.id }, data: { order: s.order } })
    )
  );

  return NextResponse.json({ ok: true });
}
