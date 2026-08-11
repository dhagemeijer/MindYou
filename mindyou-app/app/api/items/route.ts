import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ItemType } from "@prisma/client";

export async function GET() {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: true, tags: true },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, type, projectId, tags } = body as {
    title?: string;
    type?: ItemType;
    projectId?: string | null;
    tags?: string[];
  };

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Titel is verplicht" }, { status: 400 });
  }
  if (!type || !Object.values(ItemType).includes(type)) {
    return NextResponse.json({ error: "Ongeldig type" }, { status: 400 });
  }

  const item = await prisma.item.create({
    data: {
      title: title.trim(),
      type,
      projectId: projectId || null,
      tags: {
        connectOrCreate: (tags ?? [])
          .map((t) => t.trim())
          .filter(Boolean)
          .map((name) => ({
            where: { name },
            create: { name },
          })),
      },
    },
    include: { project: true, tags: true },
  });

  return NextResponse.json(item, { status: 201 });
}
