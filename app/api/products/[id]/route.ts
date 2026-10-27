import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import { scheduleCloudinaryCleanup } from "@/app/lib/media-cleanup";

type ProcessVideo = { videoUrl?: string; posterUrl?: string } | null;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();

  const duplicate = await prisma.product.findFirst({
    where: { slug: body.slug, NOT: { id } },
  });
  if (duplicate) {
    return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
  }

  const before = await prisma.product.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      shortDescription: body.shortDescription,
      fullDescription: body.fullDescription,
      images: body.images ?? [],
      price: body.price,
      unit: body.unit,
      categoryId: body.categoryId,
      variants: body.variants ?? undefined,
      nutritionSpecs: body.nutritionSpecs ?? undefined,
      certifications: body.certifications ?? [],
      nafdacNumber: body.nafdacNumber || null,
      inStock: body.inStock,
      stockCount: body.stockCount ?? null,
      isFeatured: body.isFeatured ?? false,
      isBestseller: body.isBestseller ?? false,
      isNew: body.isNew ?? false,
      processVideo: body.processVideo ?? undefined,
      seoTitle: body.seoTitle || body.name,
      seoDescription: body.seoDescription || body.shortDescription,
    },
  });

  // Clean up any images/video/poster that were swapped out for new ones.
  const beforeVideo = before.processVideo as ProcessVideo;
  const afterVideo = product.processVideo as ProcessVideo;
  const removedUrls = [
    ...before.images.filter((img) => !product.images.includes(img)),
    beforeVideo?.videoUrl !== afterVideo?.videoUrl ? beforeVideo?.videoUrl : null,
    beforeVideo?.posterUrl !== afterVideo?.posterUrl ? beforeVideo?.posterUrl : null,
  ];
  await scheduleCloudinaryCleanup(removedUrls);

  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const product = await prisma.product.delete({ where: { id } }).catch(() => null);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const video = product.processVideo as ProcessVideo;
  await scheduleCloudinaryCleanup([...product.images, video?.videoUrl, video?.posterUrl]);

  return NextResponse.json({ ok: true });
}
