"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories, getOrders } from "@/app/lib/store";
import type { Product, Order } from "@/app/lib/types";

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
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <div
          className={`text-2xl font-display font-bold tracking-tight ${color}`}
        >
          {value}
        </div>
        {sub && (
          <p className="text-[10px] font-medium text-slate-400 tracking-tight">
            {sub}
          </p>
        )}
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
  const [catCount, setCatCount] = useState(0);

  useEffect(() => {
    setProducts(getProducts());
    setOrders(getOrders());
    setCatCount(getCategories().length);
  }, []);

  const outOfStock = products.filter((p) => !p.inStock).length;
  const lowStock = products.filter(
    (p) => p.inStock && (p.stockCount ?? 0) <= 10,
  ).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-600/80">
            Internal Console
          </p>
          <h1 className="text-2xl font-display font-bold tracking-tight text-slate-950 leading-none">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 font-medium text-[11px]">
            GFO Foods Limited &mdash; Performance Snapshot
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/products/new"
            className="px-5 py-2 bg-slate-900 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats - Refined Scale */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Catalog"
          value={products.length}
          sub="Live SKU's"
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
            <h2 className="text-[12px] font-bold text-slate-950 uppercase tracking-widest">
              Inventory Snapshot
            </h2>
            <Link
              href="/admin/products"
              className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
            >
              Expand view &rarr;
            </Link>
          </div>
          <div className="p-2 space-y-0.5">
            {products.length === 0 ? (
              <div className="py-12 text-center text-[10px] font-bold text-slate-300 tracking-widest uppercase">
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
                    <p className="text-[12px] font-bold text-slate-950 truncate tracking-tight">
                      {p.name}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {p.unit} &bull;{" "}
                      {getCategories().find((c) => c.id === p.categoryId)?.name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-bold text-slate-950 tabular-nums leading-none">
                      &#8358;{p.price.toLocaleString()}
                    </p>
                    <p
                      className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${
                        !p.inStock
                          ? "text-red-500"
                          : (p.stockCount ?? 0) <= 10
                            ? "text-amber-500"
                            : "text-emerald-600"
                      }`}
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
            <h2 className="text-[12px] font-bold text-slate-950 uppercase tracking-widest">
              Recent Transactions
            </h2>
            <Link
              href="/admin/orders"
              className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
            >
              Order Desk &rarr;
            </Link>
          </div>
          <div className="p-2 space-y-0.5">
            {orders.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">
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
                    <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300 font-bold text-[10px] italic">
                      #
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900 tracking-tight">
                        {o.customerName}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 tracking-tight">
                        {new Date(o.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-950 tabular-nums">
                      &#8358;{o.totalAmount.toLocaleString()}
                    </p>
                    <span
                      className={`inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 mt-1 rounded-full border ${STATUS_COLORS[o.status]}`}
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

      {/* Summary bar - Refined Pill style */}
      <div className="mt-10 bg-slate-900 rounded-2xl py-4 px-8 flex flex-wrap items-center justify-between gap-6 animate-in slide-in-from-bottom-6 duration-1000">
        <div className="flex gap-6 items-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">
            System Pulse
          </p>
          <span className="text-white/70 text-[11px] font-medium tracking-tight">
            <span className="text-emerald-400 font-bold">
              {products.length}
            </span>{" "}
            Products &bull;{" "}
            <span className="text-amber-400 font-bold">{catCount}</span>{" "}
            Categories
          </span>
        </div>
        <div className="flex gap-4 items-center">
          {outOfStock > 0 && (
            <Link
              href="/admin/products?stock=out"
              className="text-red-400 text-[9px] font-bold uppercase tracking-widest border-b border-red-900/50 pb-0.5 hover:border-red-400 transition-all"
            >
              {outOfStock} Depleted
            </Link>
          )}
          {lowStock > 0 && (
            <Link
              href="/admin/products?stock=low"
              className="text-amber-400 text-[9px] font-bold uppercase tracking-widest border-b border-amber-900/50 pb-0.5 hover:border-amber-400 transition-all"
            >
              {lowStock} Low Stock Alert
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
