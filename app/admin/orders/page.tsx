"use client";
import { useEffect, useState } from "react";
import { fetchOrders, createOrder, updateOrder, deleteOrderApi } from "@/app/lib/api-client";
import type { Order, OrderItem, OrderStatus } from "@/app/lib/types";

const STATUS_OPTS: OrderStatus[] = [
  "pending",
  "confirmed",
  "dispatched",
  "delivered",
  "cancelled",
];

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
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    reload();
  }, []);

  function reload() {
    fetchOrders().then(setOrders);
  }

  async function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))); // instant UI update
    await updateOrder(id, { status });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this order record? This cannot be undone.")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    await deleteOrderApi(id);
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

  function updateItem(
    idx: number,
    field: keyof OrderItem,
    value: string | number,
  ) {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item,
      ),
    }));
  }

  const total = form.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    reload();
  }

  const inp =
    "w-full bg-white border border-slate-200 rounded-lg px-6 py-3.5 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300";
  const lbl = "text-caption text-slate-400 block mb-2 ml-5";

  return (
    <div className="p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
        <div className="space-y-3">
          <h1 className="text-slate-900 tracking-tighter leading-none">Orders</h1>
          <p className="text-slate-500 font-normal text-sm">
            Orders placed through WhatsApp and recorded manually
          </p>
        </div>
        <button
          onClick={() => setShowForm((f) => !f)}
          className={`text-caption px-8 py-3.5 rounded-lg transition-all active:scale-95 shadow-2xl ${
            showForm
              ? "bg-slate-50 text-slate-400 border border-slate-100"
              : "bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-900/10"
          }`}
        >
          {showForm ? "Cancel" : "+ New Order"}
        </button>
      </div>

      {/* Log form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-50 rounded-5xl border border-slate-100 p-10 mb-10 space-y-10 animate-in zoom-in-95 duration-500"
        >
          <h3 className="text-slate-900 px-2">New Order</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1 px-4">
              <label className={lbl}>Customer Name *</label>
              <input
                required
                value={form.customerName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customerName: e.target.value }))
                }
                className={inp}
                placeholder="Legal Name / Alias"
              />
            </div>
            <div className="space-y-1 px-4">
              <label className={lbl}>Phone Number</label>
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className={inp}
                placeholder="Phone / WhatsApp Number"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-6 px-4">
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
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg border border-slate-100"
                >
                  <div className="md:col-span-6 px-2">
                    <input
                      value={item.productName}
                      onChange={(e) =>
                        updateItem(idx, "productName", e.target.value)
                      }
                      className="w-full bg-transparent border-none text-sm font-semibold focus:outline-none placeholder:text-slate-200 placeholder:font-normal"
                      placeholder="Product name"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 px-2 border-l border-slate-50">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, "quantity", +e.target.value)
                      }
                      className="w-full bg-transparent border-none text-sm font-semibold text-center focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-3 px-2 border-l border-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-semibold text-xs">
                        &#8358;
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(idx, "unitPrice", +e.target.value)
                        }
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
            <div className="flex justify-end pt-4 px-4">
              <div className="text-right">
                <p className="text-caption text-slate-400 mb-1">Total</p>
                <p className="text-2xl font-extrabold text-slate-950 tabular-nums tracking-tight">
                  &#8358;{total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1 px-4">
              <label className={lbl}>Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as OrderStatus,
                  }))
                }
                className={inp}
              >
                {STATUS_OPTS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1 px-4">
              <label className={lbl}>Notes</label>
              <input
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                className={inp}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 px-4">
            <button
              type="submit"
              className="text-caption px-12 py-5 bg-slate-900 text-white rounded-lg transition-all hover:bg-emerald-600 active:scale-95 shadow-2xl shadow-black/10"
              style={{ fontSize: "12px" }}
            >
              Save Order
            </button>
          </div>
        </form>
      )}

      {/* Orders table */}
      <div className="bg-white rounded-5xl border border-slate-100 overflow-hidden shadow-2xl shadow-slate-900/2">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="text-left text-caption text-slate-400 px-8 py-5" style={{ fontSize: "10px" }}>
                  Customer
                </th>
                <th className="text-left text-caption text-slate-400 px-8 py-5" style={{ fontSize: "10px" }}>
                  Items
                </th>
                <th className="text-left text-caption text-slate-400 px-8 py-5" style={{ fontSize: "10px" }}>
                  Total
                </th>
                <th className="text-left text-caption text-slate-400 px-8 py-5" style={{ fontSize: "10px" }}>
                  Date
                </th>
                <th className="text-left text-caption text-slate-400 px-8 py-5" style={{ fontSize: "10px" }}>
                  Status
                </th>
                <th className="text-right text-caption text-slate-400 px-8 py-5" style={{ fontSize: "10px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-24 text-caption text-slate-400 italic"
                    style={{ fontSize: "11px" }}
                  >
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-slate-900 tracking-tight">
                        {o.customerName}
                      </p>
                      {o.phone && (
                        <p className="text-caption text-slate-400 mt-1.5" style={{ fontSize: "10px" }}>
                          {o.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-8 py-6">
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
                    </td>
                    <td className="px-8 py-6 text-sm font-semibold text-slate-950 tabular-nums">
                      &#8358;{o.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-caption text-slate-400 whitespace-nowrap" style={{ fontSize: "10px" }}>
                      {new Date(o.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateStatus(o.id, e.target.value as OrderStatus)
                        }
                        className={`text-caption px-4 py-1.5 rounded-lg border cursor-pointer focus:outline-none whitespace-nowrap ${STATUS_STYLES[o.status]}`}
                        style={{ fontSize: "9px" }}
                      >
                        {STATUS_OPTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all ml-auto"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
