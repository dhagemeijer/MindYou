import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.brainstormSession.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { nodes: true } } },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title } = body as { title?: string };

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Titel is verplicht" }, { status: 400 });
  }

  const session = await prisma.brainstormSession.create({
    data: { title: title.trim() },
  });

  return NextResponse.json(session, { status: 201 });
}
