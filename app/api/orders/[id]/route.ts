import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import { apiSuccess, apiError } from "@/app/lib/api-response";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }
  const { id } = await params;
  const body = await request.json();

  const order = await prisma.order
    .update({
      where: { id },
      data: {
        customerName: body.customerName,
        phone: body.phone,
        items: body.items,
        totalAmount: body.totalAmount,
        status: body.status,
        notes: body.notes ?? "",
      },
    })
    .catch(() => null);

  if (!order) return apiError("Order not found.", 404);
  return apiSuccess(order, { message: "Order updated successfully." });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }
  const { id } = await params;
  const order = await prisma.order.delete({ where: { id } }).catch(() => null);
  if (!order) return apiError("Order not found.", 404);
  return apiSuccess({ id }, { message: "Order deleted successfully." });
}
