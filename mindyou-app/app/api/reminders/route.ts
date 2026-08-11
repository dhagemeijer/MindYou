import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReminderRepeat } from "@prisma/client";

export async function GET() {
  const reminders = await prisma.reminder.findMany({
    orderBy: { time: "asc" },
    include: { step: true },
  });
  return NextResponse.json(reminders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, time, repeat, weekdays, stepId } = body as {
    title?: string;
    time?: string;
    repeat?: ReminderRepeat;
    weekdays?: number[];
    stepId?: string | null;
  };

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Titel is verplicht" }, { status: 400 });
  }
  if (!time || !/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ error: "Tijd moet HH:MM zijn" }, { status: 400 });
  }

  const reminder = await prisma.reminder.create({
    data: {
      title: title.trim(),
      time,
      repeat: repeat ?? "DAGELIJKS",
      weekdays: weekdays ?? [],
      stepId: stepId || null,
    },
    include: { step: true },
  });

  return NextResponse.json(reminder, { status: 201 });
}
