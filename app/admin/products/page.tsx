"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts, fetchCategories, deleteProductApi, type Pagination } from "@/app/lib/api-client";
import { ConfirmDialog, H1 } from "@/app/components/ui";
import { Table, type TableColumn } from "@/app/components/table";
import type { Product, Category } from "@/app/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories({ all: true }).then((res) => setCategories(res.data ?? []));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts({
      page,
      limit: 10,
      search: search.trim() || undefined,
      category: filterCategory || undefined,
    }).then((res) => {
      if (!cancelled) {
        setProducts(res.data ?? []);
        setPagination(res.pagination);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [page, search, filterCategory]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    await deleteProductApi(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    const res = await fetchProducts({
      page,
      limit: 10,
      search: search.trim() || undefined,
      category: filterCategory || undefined,
    });
    setProducts(res.data ?? []);
    setPagination(res.pagination);
  }

  const displayedProducts = products.filter((p) => {
    if (!filterStock) return true;
    const stock = p.stockCount ?? 0;
    return (
      (filterStock === "in" && stock > 10) ||
      (filterStock === "low" && stock > 0 && stock <= 10) ||
      (filterStock === "out" && stock === 0)
    );
  });

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
        <div className="space-y-2">
          <H1 className="text-3xl font-display font-bold tracking-tighter text-slate-950 leading-none">
            Products
          </H1>
          <p className="text-slate-400 font-medium text-xs">
            <span className="text-slate-900 font-bold">
              {pagination?.totalCount ?? displayedProducts.length}
            </span>{" "}
            {(pagination?.totalCount ?? displayedProducts.length) === 1 ? "product" : "products"} in your catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-900/5"
        >
          + New Product
        </Link>
      </div>

      {/* Filters - Modern Rounded Layout */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-5 bg-slate-50 rounded-4xl border border-slate-100">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-white border border-slate-200 rounded-lg px-5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(1);
          }}
          className="bg-white border border-slate-200 rounded-lg px-5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all cursor-pointer text-slate-600"
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
          className="bg-white border border-slate-200 rounded-lg px-5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all cursor-pointer text-slate-600"
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
              setPage(1);
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 px-4 py-2 border border-transparent hover:border-red-100 rounded-lg transition-all"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <Table
        data={displayedProducts}
        loading={loading}
        isPaginated={Boolean(pagination && pagination.totalPages > 1)}
        currentPage={pagination?.page ?? page}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={(p) => setPage(p)}
        emptyMessage={products.length === 0 ? "Catalog Empty." : "No matches found"}
        emptyAction={
          products.length === 0 && (
            <Link href="/admin/products/new" className="text-caption text-emerald-600 underline decoration-emerald-100">
              Add First Product
            </Link>
          )
        }
        columns={
          [
            {
              key: "name",
              label: "Product Info",
              render: (p) => (
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    {p.images[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{p.name}</p>
                    <p className="text-[11px] font-normal text-slate-400 tracking-tight">{p.unit}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "categoryId",
              label: "Category",
              className: "text-xs font-normal text-slate-500",
              render: (p) => getCategoryName(p.categoryId),
            },
            {
              key: "price",
              label: "Value",
              className: "text-sm font-semibold text-slate-950 tabular-nums",
              render: (p) => `₦${p.price.toLocaleString()}`,
            },
            {
              key: "stockCount",
              label: "Stock Status",
              render: (p) => (
                <span
                  className={`text-caption inline-block px-3 py-1 rounded-lg border ${
                    (p.stockCount ?? 0) === 0
                      ? "bg-red-50 text-red-600 border-red-100"
                      : (p.stockCount ?? 0) <= 10
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}
                  style={{ fontSize: "10px" }}
                >
                  {(p.stockCount ?? 0) === 0 ? "Depleted" : `${p.stockCount} units`}
                </span>
              ),
            },
            {
              key: "attribution",
              label: "Attribution",
              render: (p) => (
                <div className="flex gap-2 flex-wrap">
                  {p.isFeatured && (
                    <span
                      className="text-caption px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200"
                      style={{ fontSize: "8px" }}
                    >
                      Featured
                    </span>
                  )}
                  {p.isBestseller && (
                    <span
                      className="text-caption px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100"
                      style={{ fontSize: "8px" }}
                    >
                      Bestseller
                    </span>
                  )}
                  {p.isNew && (
                    <span
                      className="text-caption px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100"
                      style={{ fontSize: "8px" }}
                    >
                      New
                    </span>
                  )}
                </div>
              ),
            },
            {
              key: "actions",
              label: "",
              className: "text-right",
              render: (p) => (
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setPendingDelete(p)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-red-50"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ),
            },
          ] as TableColumn<Product>[]
        }
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete product?"
        message={`"${pendingDelete?.name}" will be permanently removed from the catalog. This can't be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
