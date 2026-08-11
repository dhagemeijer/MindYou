import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReminderRepeat } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { active, time, title, repeat, weekdays } = body as {
    active?: boolean;
    time?: string;
    title?: string;
    repeat?: ReminderRepeat;
    weekdays?: number[];
  };

  const reminder = await prisma.reminder.update({
    where: { id: params.id },
    data: {
      ...(active !== undefined ? { active } : {}),
      ...(time !== undefined ? { time } : {}),
      ...(title !== undefined ? { title } : {}),
      ...(repeat !== undefined ? { repeat } : {}),
      ...(weekdays !== undefined ? { weekdays } : {}),
    },
  });

  return NextResponse.json(reminder);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.reminder.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
