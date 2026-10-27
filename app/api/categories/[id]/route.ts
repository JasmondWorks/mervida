import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import { scheduleCloudinaryCleanup } from "@/app/lib/media-cleanup";
import { apiSuccess, apiError } from "@/app/lib/api-response";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }
  const { id } = await params;
  const body = await request.json();

  const duplicate = await prisma.category.findFirst({
    where: { slug: body.slug, NOT: { id } },
  });
  if (duplicate) {
    return apiError("Slug already in use.", 409);
  }

  const before = await prisma.category.findUnique({ where: { id } });
  if (!before) return apiError("Category not found.", 404);

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

  return apiSuccess(category, { message: "Category updated successfully." });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }
  const { id } = await params;

  const inUse = await prisma.product.count({ where: { categoryId: id } });
  if (inUse > 0) {
    return apiError(
      `Cannot delete — ${inUse} product(s) still use this category.`,
      409
    );
  }

  const category = await prisma.category.delete({ where: { id } }).catch(() => null);
  if (!category) return apiError("Category not found.", 404);

  await scheduleCloudinaryCleanup([category.image]);
  return apiSuccess({ id }, { message: "Category deleted successfully." });
}
