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
      {/* Visual Area - Refined rounding & smaller scale */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-4/5 overflow-hidden"
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
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">
              Mervida
            </span>
          </div>
        )}

        {/* Add to Cart Overlay - Smaller rounded pill */}
        {!isOutOfStock && (
          <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={handleAddToCart}
              className="w-full bg-slate-950 text-white py-3 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] transition-all hover:bg-emerald-600 active:scale-95"
            >
              Quick Add
            </button>
          </div>
        )}

        {/* Badges - Smaller, refined scale */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-emerald-600 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ring-2 ring-white">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-400 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ring-2 ring-white">
              Bestseller
            </span>
          )}
        </div>
      </Link>

      {/* Info - Clean hierarchy, refined typography scale */}
      <div className="p-5 pt-4 flex flex-col flex-1 items-start">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          {product.unit}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="block mb-2 group/link"
        >
          <h3 className="text-[17px] font-display font-bold text-slate-900 leading-tight line-clamp-2 min-h-[2.2rem] transition-colors group-hover/link:text-emerald-700 tracking-tight">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto w-full flex items-baseline justify-between">
          <span className="text-lg font-display font-black text-slate-900 tabular-nums tracking-tighter">
            &#8358;{product.price.toLocaleString()}
          </span>
          {isOutOfStock && (
            <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
