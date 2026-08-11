import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await prisma.brainstormSession.findUnique({
    where: { id: params.id },
    include: { nodes: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Sessie niet gevonden" }, { status: 404 });
  }

  return NextResponse.json(session);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { title } = body as { title?: string };

  const session = await prisma.brainstormSession.update({
    where: { id: params.id },
    data: { ...(title !== undefined ? { title } : {}) },
  });

  return NextResponse.json(session);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.brainstormSession.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
