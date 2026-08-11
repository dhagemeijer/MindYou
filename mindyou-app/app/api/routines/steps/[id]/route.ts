import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { label, icon, order } = body as {
    label?: string;
    icon?: string;
    order?: number;
  };

  const step = await prisma.routineStep.update({
    where: { id: params.id },
    data: {
      ...(label !== undefined ? { label } : {}),
      ...(icon !== undefined ? { icon } : {}),
      ...(order !== undefined ? { order } : {}),
    },
    include: { completions: true, reminders: true },
  });

  return NextResponse.json(step);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.routineStep.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
