import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const existing = await prisma.product.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
  }

  const product = await prisma.product.create({
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
  return NextResponse.json(product, { status: 201 });
}
