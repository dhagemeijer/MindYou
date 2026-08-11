import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ItemStatus, ItemType } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { status, title, type, tags, projectId } = body as {
    status?: ItemStatus;
    title?: string;
    type?: ItemType;
    tags?: string[];
    projectId?: string | null;
  };

  if (status !== undefined && !Object.values(ItemStatus).includes(status)) {
    return NextResponse.json({ error: "Ongeldige status" }, { status: 400 });
  }
  if (type !== undefined && !Object.values(ItemType).includes(type)) {
    return NextResponse.json({ error: "Ongeldig type" }, { status: 400 });
  }
  if (title !== undefined && !title.trim()) {
    return NextResponse.json({ error: "Titel mag niet leeg zijn" }, { status: 400 });
  }

  const item = await prisma.item.update({
    where: { id: params.id },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(type !== undefined ? { type } : {}),
      ...(projectId !== undefined ? { projectId: projectId || null } : {}),
      ...(tags !== undefined
        ? {
            tags: {
              set: [],
              connectOrCreate: tags
                .map((t) => t.trim())
                .filter(Boolean)
                .map((name) => ({ where: { name }, create: { name } })),
            },
          }
        : {}),
    },
    include: { project: true, tags: true },
  });

  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.item.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
