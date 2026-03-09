"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  initStore,
  getProducts,
  getSettings,
  getCategories,
} from "@/app/lib/store";
import type { Product, Category } from "@/app/lib/types";
import { useCart } from "@/app/components/CartContext";
import ProductCard from "@/app/components/ProductCard";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    initStore();
    const all = getProducts();
    const cats = getCategories();
    const found = all.find((p) => p.slug === slug);
    if (!found) {
      setNotFound(true);
      return;
    }
    setProduct(found);
    setCategories(cats);
    setMainImage(found.images[0] ?? "");
    const others = all.filter((p) => p.id !== found.id);
    const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    setRelated(shuffled);
    const s = getSettings();
    setWhatsappNumber(s.whatsappNumber ?? "");
  }, [slug]);

  function getCategoryName(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.name ?? "";
  }

  function buildSingleProductWhatsApp() {
    if (!product) return "#";
    const msg = `Hello GFO Foods! I would like to order:\n\n\u2022 ${product.name} (${product.unit}) \u00d7 ${quantity} \u2014 \u20a6${(product.price * quantity).toLocaleString()}\n\nEstimated Total: \u20a6${(product.price * quantity).toLocaleString()}\n\nKindly confirm my order and provide payment details. Thank you!`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        productName: product.name,
        nameSlug: product.slug,
        price: product.price,
        unit: product.unit,
        image: product.images[0] ?? "",
        variantLabel: null,
      });
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-300 animate-pulse italic">
          fetching product details...
        </div>
      </div>
    );
  }

  const isOutOfStock = (product.stockCount ?? 0) === 0;
  const categoryName = getCategoryName(product.categoryId);

  return (
    <main className="bg-white min-h-screen pt-32 pb-24 px-6 sm:px-12 max-w-[1440px] mx-auto animate-in fade-in duration-700">
      {/* Breadcrumb - tight, minimal */}
      <nav className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-12 flex items-center gap-3 font-display">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          Home
        </Link>
        <span className="opacity-20 text-[8px]">/</span>
        <Link
          href="/products"
          className="hover:text-emerald-700 transition-colors"
        >
          Shop
        </Link>
        <span className="opacity-20 text-[8px]">/</span>
        <span className="text-slate-900 border-b border-emerald-500/30 pb-0.5">
          {product.name}
        </span>
      </nav>

      {/* Main grid - Modern Rounded Aesthetic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 pb-24 border-b border-slate-50">
        {/* Gallery - Premium Rounded Scaling */}
        <div className="space-y-6">
          <div className="relative aspect-square bg-slate-50 border border-slate-100 rounded-5xl overflow-hidden group">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/20 to-transparent h-1/4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 scroll-hide overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative w-24 h-24 rounded-3xl border-2 transition-all overflow-hidden shrink-0 ${
                    mainImage === img
                      ? "border-emerald-500 p-1"
                      : "border-slate-100 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info - Professional Editorial Hierarchy */}
        <div className="flex flex-col items-start gap-10">
          <div className="space-y-4">
            {categoryName && (
              <p className="text-[10px] font-bold tracking-[0.4em] text-emerald-600 uppercase mb-2">
                {categoryName}
              </p>
            )}
            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tighter text-slate-950 leading-[0.9] max-w-md">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-display font-bold text-slate-950 tabular-nums">
                &#8358;{product.price.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                per {product.unit}
              </span>
            </div>
          </div>

          <p className="text-slate-500 font-medium leading-relaxed text-base sm:text-lg max-w-sm">
            {product.shortDescription ||
              "Natural, clean-label Nigerian ingredients sourced directly from smallholder ecosystems."}
          </p>

          <div className="flex items-center gap-6">
            {isOutOfStock ? (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-red-50 text-red-600 border border-red-100 px-6 py-2 rounded-full">
                Sold out temporarily
              </span>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
                  {product.stockCount ?? 0} Units left in stock
                </span>
              </div>
            )}
          </div>

          <div className="w-full h-px bg-slate-50" />

          {/* Actions - Pill Style Consistent */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            {!isOutOfStock && (
              <div className="flex items-center bg-slate-50 p-1.5 rounded-full border border-slate-100 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold transition-all text-sm flex items-center justify-center"
                >
                  -
                </button>
                <div className="w-14 text-center text-sm font-bold text-slate-950 tabular-nums font-mono">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold transition-all text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`h-16 w-full rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                isOutOfStock
                  ? "bg-slate-50 text-slate-300 border border-slate-100"
                  : "bg-slate-950 text-white hover:bg-emerald-600 shadow-2xl shadow-emerald-500/10"
              } active:scale-[0.98]`}
            >
              {isOutOfStock ? "Sold Out" : "Add to shopping bag"}
            </button>

            {!isOutOfStock && whatsappNumber && (
              <a
                href={buildSingleProductWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="h-16 w-full border border-slate-200 text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-all rounded-full font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center"
              >
                Checkout on WhatsApp
              </a>
            )}
          </div>

          {/* Certifications - Consistent List */}
          {product.certifications.length > 0 && (
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-slate-50 w-full">
              {product.certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-500 transition-colors">
                    <svg
                      className="w-3 h-3 text-emerald-600 group-hover:text-white transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-950 transition-colors">
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details - Editorial Grid Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 py-24 border-b border-slate-50">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
              Deep Dive
            </p>
            <h2 className="text-3xl font-display font-bold tracking-tight text-slate-950 uppercase leading-none">
              The Mervida Difference
            </h2>
          </div>
          <div className="text-slate-500 font-medium leading-loose text-balance sm:text-lg whitespace-pre-line">
            {product.fullDescription}
          </div>
        </div>
        {product.nutritionSpecs &&
          Object.keys(product.nutritionSpecs).length > 0 && (
            <div className="space-y-10">
              <div className="space-y-4 px-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
                  Technical Data
                </p>
                <h2 className="text-3xl font-display font-bold tracking-tight text-slate-950 uppercase leading-none">
                  Composition
                </h2>
              </div>
              <div className="bg-slate-50 rounded-5xl p-4 border border-slate-100">
                {Array.isArray(product.nutritionSpecs)
                  ? // Resilient handling for legacy/incorrect array format
                    product.nutritionSpecs.map((s: any, idx: number) => (
                      <div
                        key={s.id || idx}
                        className={`flex items-center justify-between px-10 py-6 ${
                          idx !== (product.nutritionSpecs as any).length - 1
                            ? "border-b border-white/40"
                            : ""
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                          {s.key || s.label || "Value"}
                        </span>
                        <span className="text-[13px] font-bold text-slate-950 uppercase tracking-tight">
                          {String(s.value || "")}
                        </span>
                      </div>
                    ))
                  : // Standard Record format
                    Object.entries(product.nutritionSpecs || {}).map(
                      ([key, value], idx) => (
                        <div
                          key={key}
                          className={`flex items-center justify-between px-10 py-6 ${
                            idx !==
                            Object.keys(product.nutritionSpecs || {}).length - 1
                              ? "border-b border-white/40"
                              : ""
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            {key}
                          </span>
                          <span className="text-[13px] font-bold text-slate-950 uppercase tracking-tight">
                            {String(value)}
                          </span>
                        </div>
                      ),
                    )}
              </div>
            </div>
          )}
      </div>

      {/* Related Products - Consistent Scale */}
      {related.length > 0 && (
        <div className="py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 px-4">
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
                Curated Selection
              </p>
              <h2 className="text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
                Related Goodness
              </h2>
            </div>
            <Link
              href="/products"
              className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-slate-950 transition-colors border-b-2 border-emerald-500/20 pb-1"
            >
              Browse Full Catalog &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
