import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import {
  apiSuccess,
  apiError,
  parsePaginationParams,
  buildPagination,
} from "@/app/lib/api-response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAll = searchParams.get("all") === "true";
  const categoryId = searchParams.get("category");
  const search = searchParams.get("search")?.trim();

  const where: any = {};
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  const totalCount = await prisma.product.count({ where });

  if (isAll) {
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(products, {
      pagination: {
        page: 1,
        totalPages: 1,
        totalCount,
        hasPrevious: false,
        hasNext: false,
      },
    });
  }

  const { page, limit, skip } = parsePaginationParams(searchParams, 10);
  const products = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(products, {
    pagination: buildPagination(totalCount, page, limit),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }

  const body = await request.json();
  const existing = await prisma.product.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return apiError("Slug already in use.", 409);
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

  return apiSuccess(product, {
    status: 201,
    message: "Product created successfully.",
  });
}
