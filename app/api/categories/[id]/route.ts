import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import { scheduleCloudinaryCleanup } from "@/app/lib/media-cleanup";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();

  const duplicate = await prisma.category.findFirst({
    where: { slug: body.slug, NOT: { id } },
  });
  if (duplicate) {
    return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
  }

  const before = await prisma.category.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image || null,
    },
  });

  if (before.image !== category.image) {
    await scheduleCloudinaryCleanup([before.image]);
  }

  return NextResponse.json(category);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const inUse = await prisma.product.count({ where: { categoryId: id } });
  if (inUse > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${inUse} product(s) still use this category.` },
      { status: 409 },
    );
  }

  const category = await prisma.category.delete({ where: { id } }).catch(() => null);
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await scheduleCloudinaryCleanup([category.image]);
  return NextResponse.json({ ok: true });
}
