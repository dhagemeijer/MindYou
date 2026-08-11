import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const routines = await prisma.routine.findMany({
    orderBy: { order: "asc" },
    include: {
      steps: {
        orderBy: { order: "asc" },
        include: { completions: true, reminders: true },
      },
    },
  });
  return NextResponse.json(routines);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, resetDaily } = body as { name?: string; resetDaily?: boolean };

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Naam is verplicht" }, { status: 400 });
  }

  const count = await prisma.routine.count();
  const routine = await prisma.routine.create({
    data: {
      name: name.trim(),
      resetDaily: resetDaily ?? true,
      order: count,
    },
    include: { steps: true },
  });

  return NextResponse.json(routine, { status: 201 });
}
