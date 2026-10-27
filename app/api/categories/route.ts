import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();

  const existing = await prisma.category.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image || null,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
