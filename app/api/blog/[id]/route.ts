import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import { scheduleCloudinaryCleanup } from "@/app/lib/media-cleanup";
import { sanitizeBlogHtml } from "@/app/lib/sanitize-html";
import { apiSuccess, apiError } from "@/app/lib/api-response";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return apiError("Post not found.", 404);
  return apiSuccess(post);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }
  const { id } = await params;
  const body = await request.json();

  const duplicate = await prisma.blogPost.findFirst({
    where: { slug: body.slug, NOT: { id } },
  });
  if (duplicate) {
    return apiError("Slug already in use.", 409);
  }

  const before = await prisma.blogPost.findUnique({ where: { id } });
  if (!before) return apiError("Post not found.", 404);

  const wasPublished = before.status === "published";
  const isPublished = body.status === "published";

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      body: sanitizeBlogHtml(body.body),
      coverImage: body.coverImage || null,
      status: body.status ?? "draft",
      publishedAt: !wasPublished && isPublished ? new Date() : before.publishedAt,
    },
  });

  if (before.coverImage !== post.coverImage) {
    await scheduleCloudinaryCleanup([before.coverImage]);
  }

  return apiSuccess(post, { message: "Blog post updated successfully." });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }
  const { id } = await params;

  const post = await prisma.blogPost.delete({ where: { id } }).catch(() => null);
  if (!post) return apiError("Post not found.", 404);

  await scheduleCloudinaryCleanup([post.coverImage]);
  return apiSuccess({ id }, { message: "Blog post deleted successfully." });
}
