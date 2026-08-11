import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD, server timezone
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const step = await prisma.routineStep.findUnique({
    where: { id: params.id },
    include: { routine: true },
  });
  if (!step) {
    return NextResponse.json({ error: "Stap niet gevonden" }, { status: 404 });
  }

  const dateKey = step.routine.resetDaily ? todayKey() : "ALL";

  const existing = await prisma.routineCompletion.findUnique({
    where: { stepId_dateKey: { stepId: step.id, dateKey } },
  });

  if (existing) {
    await prisma.routineCompletion.delete({ where: { id: existing.id } });
  } else {
    await prisma.routineCompletion.create({
      data: { stepId: step.id, dateKey },
    });
  }

  const updated = await prisma.routineStep.findUnique({
    where: { id: params.id },
    include: { completions: true, reminders: true },
  });

  return NextResponse.json(updated);
}
