import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import { sanitizeBlogHtml } from "@/app/lib/sanitize-html";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = !(await isAdminRequest());

  const posts = await prisma.blogPost.findMany({
    where: publishedOnly ? { status: "published" } : undefined,
    orderBy: { createdAt: "desc" },
  });

  if (searchParams.get("slug")) {
    const post = posts.find((p) => p.slug === searchParams.get("slug"));
    return NextResponse.json(post ?? null);
  }
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();

  const existing = await prisma.blogPost.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
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
  return NextResponse.json(post, { status: 201 });
}
