"use client";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/app/lib/types";
import { useCart } from "./CartContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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

  const isOutOfStock = !product.inStock;

  return (
    <div className="group relative bg-[#faf9f7] rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-500 hover:-translate-y-1">
      {/* Image Area */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square overflow-hidden"
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <span className="text-slate-300 text-[10px] font-medium uppercase tracking-widest italic">
              Mervida
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-emerald-600 text-white text-[8px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-500 text-white text-[8px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Bestseller
            </span>
          )}
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Unit label */}
        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">
          {product.unit}
        </p>

        {/* Product name */}
        <Link
          href={`/products/${product.slug}`}
          className="block mb-3 group/link"
        >
          <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 leading-snug line-clamp-2 min-h-[2.4em] transition-colors group-hover/link:text-emerald-700">
            {product.name}
          </h3>
        </Link>

        {/* Divider */}
        <div className="border-t border-slate-200/60 my-auto" />

        {/* Price + Action row */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-lg font-bold text-slate-900 tabular-nums tracking-tight">
            &#8358;{product.price.toLocaleString()}
          </span>

          {isOutOfStock ? (
            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-full">
              Sold out
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className="bg-slate-900 text-white p-2.5 rounded-full transition-all hover:bg-emerald-600 active:scale-90 shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
