import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import { sanitizeBlogHtml } from "@/app/lib/sanitize-html";
import {
  apiSuccess,
  apiError,
  parsePaginationParams,
  buildPagination,
} from "@/app/lib/api-response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get("all") === "true";
  const slug = searchParams.get("slug");
  const isPreview = searchParams.get("preview") === "true";
  const isAdmin = await isAdminRequest();

  // If requesting a specific post by slug:
  if (slug) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) return apiError("Post not found.", 404);

    // If it's a draft, ONLY allow viewing if admin or authorized preview
    if (post.status === "draft") {
      if (isAdmin || isPreview) {
        return apiSuccess(post);
      }
      return apiError("Post not found.", 404);
    }

    return apiSuccess(post);
  }

  const { page, limit, skip } = parsePaginationParams(searchParams, 10);

  // If requesting all posts (Admin Dashboard only)
  if (includeAll) {
    if (!isAdmin) {
      return apiError("Unauthorized", 401);
    }
    const totalCount = await prisma.blogPost.count();
    const posts = await prisma.blogPost.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(posts, {
      pagination: buildPagination(totalCount, page, limit),
    });
  }

  // Public blog list: ALWAYS only published posts
  const totalCount = await prisma.blogPost.count({
    where: { status: "published" },
  });
  const publishedPosts = await prisma.blogPost.findMany({
    where: { status: "published" },
    skip,
    take: limit,
    orderBy: { publishedAt: "desc" },
  });

  return apiSuccess(publishedPosts, {
    pagination: buildPagination(totalCount, page, limit),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }
  const body = await request.json();

  const existing = await prisma.blogPost.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return apiError("Slug already in use.", 409);
  }

  const post = await prisma.blogPost.create({
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      body: sanitizeBlogHtml(body.body),
      coverImage: body.coverImage || null,
      status: body.status ?? "draft",
      publishedAt: body.status === "published" ? new Date() : null,
    },
  });

  return apiSuccess(post, {
    status: 201,
    message: "Blog post created successfully.",
  });
}
