"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories, deleteProduct } from "@/app/lib/store";
import type { Product, Category } from "@/app/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStock, setFilterStock] = useState("");

  useEffect(() => {
    setProducts(getProducts());
    setCategories(getCategories());
  }, []);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    deleteProduct(id);
    setProducts(getProducts());
  }

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.includes(search.toLowerCase());
    const matchCategory = !filterCategory || p.categoryId === filterCategory;
    const stock = p.stockCount ?? 0;
    const matchStock =
      !filterStock ||
      (filterStock === "in" && stock > 10) ||
      (filterStock === "low" && stock > 0 && stock <= 10) ||
      (filterStock === "out" && stock === 0);
    return matchSearch && matchCategory && matchStock;
  });

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600">
            Inventory Management
          </p>
          <h1 className="text-3xl font-display font-bold tracking-tighter text-slate-950 leading-none">
            Products Collection
          </h1>
          <p className="text-slate-400 font-medium text-xs">
            Manage{" "}
            <span className="text-slate-900 font-bold">{filtered.length}</span>{" "}
            SKU's in your current catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-900/5"
        >
          + Add New Product
        </Link>
      </div>

      {/* Filters - Modern Rounded Layout */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-5 bg-slate-50 rounded-4xl border border-slate-100">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white border border-slate-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all cursor-pointer text-slate-600"
        >
          <option value="">Categories (All)</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="bg-white border border-slate-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all cursor-pointer text-slate-600"
        >
          <option value="">Stock Levels (All)</option>
          <option value="in">Sufficient Stock</option>
          <option value="low">Low Stock (1–10)</option>
          <option value="out">Depleted (0)</option>
        </select>
        {(search || filterCategory || filterStock) && (
          <button
            onClick={() => {
              setSearch("");
              setFilterCategory("");
              setFilterStock("");
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 px-4 py-2 border border-transparent hover:border-red-100 rounded-full transition-all"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table - Consistent Modern Container */}
      <div className="bg-white rounded-5xl border border-slate-100 overflow-hidden shadow-2xl shadow-slate-900/1">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="text-left text-[11px] font-bold text-slate-400 tracking-tight px-8 py-4">
                  Product Info
                </th>
                <th className="text-left text-[11px] font-bold text-slate-400 tracking-tight px-8 py-4">
                  Category
                </th>
                <th className="text-left text-[11px] font-bold text-slate-400 tracking-tight px-8 py-4">
                  Value
                </th>
                <th className="text-left text-[11px] font-bold text-slate-400 tracking-tight px-8 py-4">
                  Stock Status
                </th>
                <th className="text-left text-[11px] font-bold text-slate-400 tracking-tight px-8 py-4">
                  Attribution
                </th>
                <th className="text-right text-[11px] font-bold text-slate-400 tracking-tight px-8 py-4">
                  Management
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-24 text-[11px] font-bold text-slate-400 tracking-widest uppercase"
                  >
                    {products.length === 0 ? (
                      <div>
                        Catalog Empty.{" "}
                        <Link
                          href="/admin/products/new"
                          className="text-emerald-600 underline decoration-emerald-100"
                        >
                          Add First Product
                        </Link>
                      </div>
                    ) : (
                      "No matches found"
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                          {p.images[0] ? (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[14px] font-semibold text-slate-900 leading-tight">
                            {p.name}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 tracking-tight">
                            {p.unit}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-[12px] font-medium text-slate-500">
                      {getCategoryName(p.categoryId)}
                    </td>
                    <td className="px-8 py-4 text-sm font-bold text-slate-950 tabular-nums">
                      &#8358;{p.price.toLocaleString()}
                    </td>
                    <td className="px-8 py-4">
                      <span
                        className={`inline-block text-[10px] font-bold tracking-tight px-3 py-1 rounded-full border ${
                          (p.stockCount ?? 0) === 0
                            ? "bg-red-50 text-red-600 border-red-100"
                            : (p.stockCount ?? 0) <= 10
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}
                      >
                        {(p.stockCount ?? 0) === 0
                          ? "Depleted"
                          : `${p.stockCount} units`}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {p.isFeatured && (
                          <span className="text-[8px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold uppercase tracking-widest border border-slate-200">
                            Featured
                          </span>
                        )}
                        {p.isBestseller && (
                          <span className="text-[8px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full font-bold uppercase tracking-widest border border-amber-100">
                            Bestseller
                          </span>
                        )}
                        {p.isNew && (
                          <span className="text-[8px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold uppercase tracking-widest border border-emerald-100">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-red-50"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
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
