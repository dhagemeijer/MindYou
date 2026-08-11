import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { name, resetDaily, order } = body as {
    name?: string;
    resetDaily?: boolean;
    order?: number;
  };

  const routine = await prisma.routine.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(resetDaily !== undefined ? { resetDaily } : {}),
      ...(order !== undefined ? { order } : {}),
    },
  });

  return NextResponse.json(routine);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.routine.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { label, icon } = body as { label?: string; icon?: string };

  if (!label || !label.trim()) {
    return NextResponse.json({ error: "Naam is verplicht" }, { status: 400 });
  }

  const count = await prisma.routineStep.count({ where: { routineId: params.id } });
  const step = await prisma.routineStep.create({
    data: {
      label: label.trim(),
      icon: icon || "check",
      order: count,
      routineId: params.id,
    },
    include: { completions: true, reminders: true },
  });

  return NextResponse.json(step, { status: 201 });
}
