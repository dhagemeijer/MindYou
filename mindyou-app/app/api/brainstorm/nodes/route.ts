import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, parentId, label } = body as {
    sessionId?: string;
    parentId?: string | null;
    label?: string;
  };

  if (!sessionId || !label || !label.trim()) {
    return NextResponse.json({ error: "sessionId en label zijn verplicht" }, { status: 400 });
  }

  const node = await prisma.brainstormNode.create({
    data: {
      sessionId,
      parentId: parentId || null,
      label: label.trim(),
    },
  });

  return NextResponse.json(node, { status: 201 });
}
