import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();

  const order = await prisma.order.create({
    data: {
      customerName: body.customerName,
      phone: body.phone,
      items: body.items,
      totalAmount: body.totalAmount,
      status: body.status ?? "pending",
      notes: body.notes ?? "",
    },
  });
  return NextResponse.json(order, { status: 201 });
}
