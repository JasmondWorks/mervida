"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts, fetchCategories, fetchOrders } from "@/app/lib/api-client";
import type { Product, Order, Category } from "@/app/lib/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
  dispatched: "bg-slate-900 text-white border-transparent",
  delivered: "bg-emerald-600 text-white border-transparent",
  cancelled: "bg-red-50 text-red-600 border-red-100",
};

function StatCard({
  label,
  value,
  sub,
  href,
  color,
}: {
  label: string;
  value: number | string;
  sub?: string;
  href?: string;
  color: string;
}) {
  const inner = (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <p className="text-caption text-slate-400" style={{ fontSize: "10px" }}>
          {label}
        </p>
        <div className={`text-2xl font-extrabold tracking-tight ${color}`}>{value}</div>
        {sub && <p className="text-xs font-normal text-slate-400 tracking-tight">{sub}</p>}
      </div>
      <div
        className={`w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 ${color} opacity-40`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18 9 11.25l4.5 4.5 6.75-6.75M2.25 18l4.5-4.5 4.5 4.5 6.75-6.75"
          />
        </svg>
      </div>
    </div>
  );

  const cls = `bg-white p-5 rounded-3xl border border-slate-100 transition-all duration-300 ${
    href
      ? "hover:border-emerald-500 hover:shadow-sm hover:translate-y-[-2px] cursor-pointer block"
      : ""
  }`;

  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchOrders().then(setOrders);
    fetchCategories().then(setCategories);
  }, []);

  const catCount = categories.length;
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name;

  const outOfStock = products.filter((p) => !p.inStock).length;
  const lowStock = products.filter(
    (p) => p.inStock && (p.stockCount ?? 0) <= 10,
  ).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-slate-950 tracking-tight leading-none" style={{ fontSize: "1.5rem" }}>
            Dashboard
          </h1>
          <p className="text-slate-400 font-normal text-[11px]">
            GFO Foods Limited &mdash; today&rsquo;s snapshot
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/products/new"
            className="text-caption px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
            style={{ fontSize: "10px" }}
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Catalog"
          value={products.length}
          sub="Live products"
          href="/admin/products"
          color="text-slate-900"
        />
        <StatCard
          label="Depleted"
          value={outOfStock}
          sub="Out of Stock"
          color="text-red-500"
        />
        <StatCard
          label="Low Stock"
          value={lowStock}
          sub="Restock Warning"
          color="text-amber-500"
        />
        <StatCard
          label="Orders"
          value={pendingOrders}
          sub="Pending Orders"
          href="/admin/orders"
          color="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Products quick view */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/30">
            <h4 className="text-slate-950" style={{ fontSize: "12px" }}>
              Inventory Snapshot
            </h4>
            <Link
              href="/admin/products"
              className="text-caption text-slate-400 hover:text-emerald-600 transition-colors"
              style={{ fontSize: "9px" }}
            >
              Expand view &rarr;
            </Link>
          </div>
          <div className="p-2 space-y-0.5">
            {products.length === 0 ? (
              <div className="py-12 text-center text-caption text-slate-300" style={{ fontSize: "10px" }}>
                Catalog Empty
              </div>
            ) : (
              products.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-slate-50 transition-all group"
                >
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={`Thumbnail for ${p.name}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-950 truncate tracking-tight">
                      {p.name}
                    </p>
                    <p className="text-caption text-slate-400 mt-1" style={{ fontSize: "9px" }}>
                      {p.unit} &bull; {categoryName(p.categoryId)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-slate-950 tabular-nums leading-none">
                      &#8358;{p.price.toLocaleString()}
                    </p>
                    <p
                      className={`text-caption mt-2 ${
                        !p.inStock
                          ? "text-red-500"
                          : (p.stockCount ?? 0) <= 10
                            ? "text-amber-500"
                            : "text-emerald-600"
                      }`}
                      style={{ fontSize: "9px" }}
                    >
                      {!p.inStock ? "Depleted" : `${p.stockCount ?? 0} units`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/30">
            <h4 className="text-slate-950" style={{ fontSize: "12px" }}>
              Recent Transactions
            </h4>
            <Link
              href="/admin/orders"
              className="text-caption text-slate-400 hover:text-emerald-600 transition-colors"
              style={{ fontSize: "9px" }}
            >
              Order Desk &rarr;
            </Link>
          </div>
          <div className="p-2 space-y-0.5">
            {orders.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-caption text-slate-300" style={{ fontSize: "10px" }}>
                  No orders logged
                </p>
              </div>
            ) : (
              orders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300 font-semibold text-[10px] italic">
                      #
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 tracking-tight">
                        {o.customerName}
                      </p>
                      <p className="text-xs font-normal text-slate-400 tracking-tight">
                        {new Date(o.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-950 tabular-nums">
                      &#8358;{o.totalAmount.toLocaleString()}
                    </p>
                    <span
                      className={`text-caption inline-block px-2 py-0.5 mt-1 rounded-lg border ${STATUS_COLORS[o.status]}`}
                      style={{ fontSize: "8px" }}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="mt-10 bg-slate-50 border border-slate-100 rounded-2xl py-4 px-8 flex flex-wrap items-center justify-between gap-6 animate-in slide-in-from-bottom-6 duration-1000">
        <div className="flex gap-6 items-center">
          <p className="text-caption text-slate-400" style={{ fontSize: "9px" }}>
            System Pulse
          </p>
          <span className="text-slate-600 text-[11px] font-normal tracking-tight">
            <span className="text-emerald-600 font-semibold">{products.length}</span>{" "}
            Products &bull;{" "}
            <span className="text-amber-600 font-semibold">{catCount}</span> Categories
          </span>
        </div>
        <div className="flex gap-4 items-center">
          {outOfStock > 0 && (
            <Link
              href="/admin/products?stock=out"
              className="text-caption text-red-500 border-b border-red-200 pb-0.5 hover:border-red-500 transition-all"
              style={{ fontSize: "9px" }}
            >
              {outOfStock} Depleted
            </Link>
          )}
          {lowStock > 0 && (
            <Link
              href="/admin/products?stock=low"
              className="text-caption text-amber-600 border-b border-amber-200 pb-0.5 hover:border-amber-500 transition-all"
              style={{ fontSize: "9px" }}
            >
              {lowStock} Low Stock Alert
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
