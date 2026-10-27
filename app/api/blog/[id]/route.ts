import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import { scheduleCloudinaryCleanup } from "@/app/lib/media-cleanup";
import { sanitizeBlogHtml } from "@/app/lib/sanitize-html";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();

  const duplicate = await prisma.blogPost.findFirst({
    where: { slug: body.slug, NOT: { id } },
  });
  if (duplicate) {
    return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
  }

  const before = await prisma.blogPost.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

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

  return NextResponse.json(post);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const post = await prisma.blogPost.delete({ where: { id } }).catch(() => null);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await scheduleCloudinaryCleanup([post.coverImage]);
  return NextResponse.json({ ok: true });
}
