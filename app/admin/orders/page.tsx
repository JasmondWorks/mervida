"use client";
import { useEffect, useState } from "react";
import { fetchOrders, createOrder, updateOrder, deleteOrderApi, type Pagination } from "@/app/lib/api-client";
import { Button, Field, Modal, ConfirmDialog, H1, type SelectOption } from "@/app/components/ui";
import { Table, type TableColumn } from "@/app/components/table";
import type { Order, OrderItem, OrderStatus } from "@/app/lib/types";

const STATUS_OPTS: OrderStatus[] = [
  "pending",
  "confirmed",
  "dispatched",
  "delivered",
  "cancelled",
];

const STATUS_OPTIONS: SelectOption[] = STATUS_OPTS.map((s) => ({
  label: s.charAt(0).toUpperCase() + s.slice(1),
  value: s,
}));

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
  dispatched: "bg-slate-900 text-white border-transparent",
  delivered: "bg-emerald-600 text-white border-transparent",
  cancelled: "bg-red-50 text-red-600 border-red-100",
};

const EMPTY_FORM = {
  customerName: "",
  phone: "",
  items: [{ productName: "", quantity: 1, unitPrice: 0 }] as OrderItem[],
  status: "pending" as OrderStatus,
  notes: "",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    reload(page);
  }, [page]);

  async function reload(targetPage = page) {
    setLoading(true);
    const res = await fetchOrders({ page: targetPage, limit: 10 });
    setOrders(res.data ?? []);
    setPagination(res.pagination);
    setLoading(false);
  }

  async function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))); // instant UI update
    await updateOrder(id, { status });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    await deleteOrderApi(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    reload(page);
  }

  function addItem() {
    setForm((f) => ({
      ...f,
      items: [...f.items, { productName: "", quantity: 1, unitPrice: 0 }],
    }));
  }

  function removeItem(idx: number) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  function updateItem(idx: number, field: keyof OrderItem, value: string | number) {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }));
  }

  const total = form.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  async function handleSubmit() {
    setSaving(true);
    await createOrder({
      customerName: form.customerName,
      phone: form.phone,
      items: form.items,
      totalAmount: total,
      status: form.status,
      notes: form.notes,
    });
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
    setSaving(false);
    setPage(1);
    reload(1);
  }

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
        <div className="space-y-3">
          <H1 className="text-slate-900 tracking-tighter leading-none">Orders</H1>
          <p className="text-slate-500 font-normal text-sm">
            Orders placed through WhatsApp and recorded manually
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="shadow-2xl shadow-slate-900/10">
          + New Order
        </Button>
      </div>

      {/* Orders table */}
      <Table
        data={orders}
        loading={loading}
        isPaginated={Boolean(pagination && pagination.totalPages > 1)}
        currentPage={pagination?.page ?? page}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={(p) => setPage(p)}
        emptyMessage="No orders yet"
        columns={
          [
            {
              key: "customerName",
              label: "Customer",
              render: (o) => (
                <>
                  <p className="text-sm font-semibold text-slate-900 tracking-tight">{o.customerName}</p>
                  {o.phone && (
                    <p className="text-caption text-slate-400 mt-1.5" style={{ fontSize: "10px" }}>
                      {o.phone}
                    </p>
                  )}
                </>
              ),
            },
            {
              key: "items",
              label: "Items",
              render: (o) => (
                <>
                  <div className="space-y-1">
                    {o.items.map((item, i) => (
                      <p key={i} className="text-xs font-normal text-slate-600 tracking-tight">
                        {item.productName} (x{item.quantity})
                      </p>
                    ))}
                  </div>
                  {o.notes && (
                    <p className="text-[11px] text-slate-400 font-normal mt-2 border-l border-slate-100 pl-2 max-w-35 truncate">
                      {o.notes}
                    </p>
                  )}
                </>
              ),
            },
            {
              key: "totalAmount",
              label: "Total",
              className: "text-sm font-semibold text-slate-950 tabular-nums",
              render: (o) => `₦${o.totalAmount.toLocaleString()}`,
            },
            {
              key: "createdAt",
              label: "Date",
              className: "text-caption text-slate-400 whitespace-nowrap",
              render: (o) =>
                new Date(o.createdAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
            },
            {
              key: "status",
              label: "Status",
              render: (o) => (
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                  className={`text-caption px-4 py-1.5 rounded-lg border cursor-pointer focus:outline-none whitespace-nowrap ${STATUS_STYLES[o.status]}`}
                  style={{ fontSize: "9px" }}
                >
                  {STATUS_OPTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ),
            },
          ] as TableColumn<Order>[]
        }
        actions={[{ label: "Delete", onClick: setPendingDelete, className: "text-red-500" }]}
      />

      {/* New Order modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="New Order"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={saving} className="shadow-2xl shadow-black/10">
              Save Order
            </Button>
          </>
        }
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Customer Name"
              required
              value={form.customerName}
              onValueChange={(v) => setForm((f) => ({ ...f, customerName: v }))}
              placeholder="Legal Name / Alias"
            />
            <Field
              label="Phone Number"
              value={form.phone}
              onValueChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              placeholder="Phone / WhatsApp Number"
            />
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-caption text-slate-900">Items</label>
              <button
                type="button"
                onClick={addItem}
                className="text-caption text-emerald-600 hover:text-slate-900 transition-colors"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-3">
              {form.items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-100"
                >
                  <div className="md:col-span-6 px-2">
                    <input
                      value={item.productName}
                      onChange={(e) => updateItem(idx, "productName", e.target.value)}
                      className="w-full bg-transparent border-none text-sm font-semibold focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
                      placeholder="Product name"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 px-2 border-l border-slate-200">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, "quantity", +e.target.value)}
                      className="w-full bg-transparent border-none text-sm font-semibold text-center focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-3 px-2 border-l border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-semibold text-xs">&#8358;</span>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(idx, "unitPrice", +e.target.value)}
                        className="w-full bg-transparent border-none text-sm font-semibold focus:outline-none tabular-nums"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-slate-300 hover:text-red-500 transition-colors px-2 font-semibold"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <div className="text-right">
                <p className="text-caption text-slate-400 mb-1">Total</p>
                <p className="text-2xl font-extrabold text-slate-950 tabular-nums tracking-tight">
                  &#8358;{total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Status"
              type="select"
              options={STATUS_OPTIONS}
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v as OrderStatus }))}
            />
            <Field
              label="Notes"
              value={form.notes}
              onValueChange={(v) => setForm((f) => ({ ...f, notes: v }))}
              placeholder="Optional"
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete order record?"
        message={`The order for "${pendingDelete?.customerName}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
