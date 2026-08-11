import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { label } = body as { label?: string };

  if (label !== undefined && !label.trim()) {
    return NextResponse.json({ error: "label mag niet leeg zijn" }, { status: 400 });
  }

  const node = await prisma.brainstormNode.update({
    where: { id: params.id },
    data: { ...(label !== undefined ? { label: label.trim() } : {}) },
  });

  return NextResponse.json(node);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.brainstormNode.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
