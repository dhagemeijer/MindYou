import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ItemType } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { type } = body as { type?: ItemType };

  if (!type || !Object.values(ItemType).includes(type)) {
    return NextResponse.json({ error: "Ongeldig type" }, { status: 400 });
  }

  const node = await prisma.brainstormNode.findUnique({ where: { id: params.id } });
  if (!node) {
    return NextResponse.json({ error: "Knooppunt niet gevonden" }, { status: 404 });
  }
  if (node.promotedItemId) {
    return NextResponse.json({ error: "Al omgezet" }, { status: 409 });
  }

  const item = await prisma.item.create({
    data: { title: node.label, type },
  });

  const updatedNode = await prisma.brainstormNode.update({
    where: { id: node.id },
    data: { promotedItemId: item.id },
  });

  return NextResponse.json({ node: updatedNode, item });
}
