import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import {
  apiSuccess,
  apiError,
  parsePaginationParams,
  buildPagination,
} from "@/app/lib/api-response";

export async function GET(request: Request) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const isAll = searchParams.get("all") === "true";

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const totalCount = await prisma.order.count({ where });

  if (isAll) {
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(orders, {
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
  const orders = await prisma.order.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(orders, {
    pagination: buildPagination(totalCount, page, limit),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
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

  return apiSuccess(order, {
    status: 201,
    message: "Order recorded successfully.",
  });
}
