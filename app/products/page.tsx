"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { initStore, getProducts, getCategories } from "@/app/lib/store";
import type { Product, Category } from "@/app/lib/types";
import ProductCard from "@/app/components/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    initStore();
    setProducts(getProducts());
    setCategories(getCategories());
  }, []);

  const categoryQuery = searchParams.get("category") || "all";

  // Match category by ID or slug
  const activeCategoryObj = categories.find(
    (c) => c.id === categoryQuery || c.slug === categoryQuery
  );

  const activeCategoryId = activeCategoryObj
    ? activeCategoryObj.id
    : categoryQuery === "all"
    ? "all"
    : categoryQuery;

  const handleSelectCategory = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId === "all") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const filtered = products.filter((p) => {
    if (activeCategoryId === "all") return true;
    return p.categoryId === activeCategoryId;
  });

  return (
    <main className="bg-white min-h-screen pt-32 pb-24 max-w-[1440px] mx-auto animate-in fade-in duration-1000">
      {/* Header section - Engaging Pattern Background */}
      <div className="px-6 sm:px-12 pb-12 border-b border-slate-50 flex flex-col md:flex-row md:items-end justify-between gap-10 bg-pattern-subtle rounded-t-[3rem] pt-12">
        <div className="space-y-4">
          <nav className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 mb-8 font-display flex items-center gap-3">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <span className="opacity-20 text-[8px]">/</span>
            <span className="text-slate-900 border-b border-emerald-500/30 pb-0.5 font-semibold">
              Shop
            </span>
          </nav>
          <h1 className="text-5xl sm:text-6xl font-display font-bold tracking-tighter text-slate-950 leading-[0.9]">
            The Collection.
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-sm leading-relaxed">
            Browse our curated selection of{" "}
            <span className="text-slate-950 font-bold">
              {filtered.length} natural products
            </span>{" "}
            sourced with integrity.
          </p>
        </div>

        {/* Category filter - Modern Rounded layout */}
        <div className="flex flex-col items-start gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 ml-4">
            Categories
          </p>
          <div className="flex gap-2 flex-wrap p-1.5 bg-slate-50 rounded-full border border-slate-100">
            <button
              onClick={() => handleSelectCategory("all")}
              className={`px-6 py-2.5 rounded-full text-[11px] font-semibold tracking-tight transition-all duration-300 ${
                activeCategoryId === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-white"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-[11px] font-semibold tracking-tight transition-all duration-300 ${
                  activeCategoryId === cat.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products grid - Consistent gap, rounded style */}
      <div className="px-6 sm:px-12 py-12 sm:py-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <svg
                className="w-5 h-5 text-slate-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-8">
              No products found in this category.
            </p>
            <button
              onClick={() => handleSelectCategory("all")}
              className="text-[11px] font-semibold tracking-widest uppercase text-slate-950 border-b border-emerald-500 pb-1 hover:text-emerald-700 transition-colors"
            >
              View all items
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-slate-400 text-sm">Loading collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
