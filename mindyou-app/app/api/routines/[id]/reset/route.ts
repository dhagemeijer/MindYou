import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.routineCompletion.deleteMany({
    where: { step: { routineId: params.id } },
  });

  const routine = await prisma.routine.findUnique({
    where: { id: params.id },
    include: {
      steps: {
        orderBy: { order: "asc" },
        include: { completions: true, reminders: true },
      },
    },
  });

  return NextResponse.json(routine);
}
