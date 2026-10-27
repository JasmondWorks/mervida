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

  const totalCount = await prisma.category.count();

  if (isAll) {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(categories, {
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
  const categories = await prisma.category.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(categories, {
    pagination: buildPagination(totalCount, page, limit),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }
  const body = await request.json();

  const existing = await prisma.category.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return apiError("Slug already in use.", 409);
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image || null,
    },
  });

  return apiSuccess(category, {
    status: 201,
    message: "Category created successfully.",
  });
}
