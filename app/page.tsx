"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { initStore, getProducts } from "@/app/lib/store";
import type { Product } from "@/app/lib/types";
import HeroCarousel from "@/app/components/HeroCarousel";
import ProductCard from "@/app/components/ProductCard";

const SERVICES = [
  {
    title: "Premium Exports",
    description: "Sourcing and shipping the finest African foods worldwide",
    icon: (
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
          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    ),
  },
  {
    title: "Personal Shippers",
    description:
      "Sourcing for clients abroad and their aged parents in Nigeria",
    icon: (
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
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
    ),
  },
  {
    title: "Wholesale & Private Label",
    description: "Bulk supply and custom branding for businesses",
    icon: (
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
          d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
    ),
  },
  {
    title: "Wellness Solutions",
    description: "Natural seasonings and herbal personal care",
    icon: (
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
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    initStore();
    const all = getProducts();
    const f = all.filter((p) => p.isFeatured || p.isBestseller).slice(0, 4);
    setFeatured(f);
  }, []);

  return (
    <main className="bg-white">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Featured Products - Refined scale & smaller elements */}
      <section className="py-12 sm:py-20 px-6 sm:px-12 max-w-[1440px] mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 px-3 py-1 bg-emerald-50 w-fit rounded-full border border-emerald-100">
              Mervida Selection
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-900 leading-none">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-700 transition-all border-b border-transparent hover:border-emerald-700 pb-1"
          >
            View all collection &rarr;
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-100 rounded-4xl p-16 text-center animate-fade-in transition-all">
            <p className="text-slate-400 font-medium italic">
              Featured products arriving soon.
            </p>
          </div>
        )}

        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center justify-center text-[11px] font-bold tracking-[0.2em] uppercase text-white bg-slate-950 px-10 py-4 rounded-full transition-all hover:bg-emerald-600 active:scale-95 shadow-md"
          >
            Browse collection
          </Link>
        </div>
      </section>

      {/* Brand / About section - Tighter hierarchy & smaller elements */}
      <section className="px-6 sm:px-12 py-10 max-w-[1440px] mx-auto mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-slate-50 rounded-4xl overflow-hidden shadow-xs">
          {/* Left Content */}
          <div className="p-10 sm:p-16 lg:p-20 flex flex-col justify-center bg-white border-r border-slate-50">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-6">
              Our Commitment
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold leading-tight tracking-tighter mb-8 text-slate-950">
              Premium. Natural.
              <br />
              Nigerian.
            </h2>
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-md mb-10 font-medium">
              GFO FOODS LIMITED is dedicated to the finest natural ingredients
              from Nigeria. Our Mervida brand stands for clean-label,
              no-compromise food products — made with integrity, sourced with
              care.
            </p>
            <Link
              href="/about"
              className="group flex items-center gap-4 text-[11px] font-bold tracking-widest uppercase text-slate-900 w-fit transition-all"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all duration-300 shadow-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
              <span className="transition-colors group-hover:text-emerald-700 underline underline-offset-8 decoration-slate-200">
                Learn our story
              </span>
            </Link>
          </div>

          {/* Right: image - no scaling, focus on quality */}
          <div className="relative h-[400px] lg:h-auto overflow-hidden">
            <Image
              src="/images/Gemini_Generated_Image_n4osk1n4osk1n4os.png"
              fill
              className="object-cover grayscale-30 hover:grayscale-0 transition-all duration-700 brightness-95 hover:brightness-100"
              alt="GFO Foods products"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Services - Sharp Cards - Tighter grid */}
      <section className="py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-2xl mb-16 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
              Service Offering
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tighter text-slate-900 leading-tight">
              Quality at every scale.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className="group p-8 bg-slate-50 rounded-3xl border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 cursor-default"
              >
                <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center mb-10 transition-transform duration-500 group-hover:scale-110 shadow-lg shadow-slate-200">
                  {service.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-slate-950 mb-4 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-[13px] leading-relaxed group-hover:text-slate-700 transition-colors font-medium">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Landing Subset */}
      <section className="py-24 px-6 sm:px-12 bg-slate-50/50">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600">
              Support Portal
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tighter text-slate-950 leading-[1.1]">
              Common <br /> Inquiries.
            </h2>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-700 hover:text-slate-950 transition-all border-b border-emerald-500/20 pb-1"
            >
              Explore full support desk &rarr;
            </Link>
          </div>

          <div className="space-y-10">
            {[
              {
                q: "How do I place an order?",
                a: "Browse our products, add items to your cart, then click 'Checkout via WhatsApp'. We will confirm your order and provide payment details directly.",
              },
              {
                q: "Are the products natural/organic?",
                a: "Yes. Our Mervida products are clean-label with no artificial preservatives, flavours, or MSG. We believe in honest, transparent ingredients.",
              },
              {
                q: "Do you deliver nationwide?",
                a: "Yes, we deliver across Nigeria. Delivery fees vary by location and are confirmed during our WhatsApp consultation.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="group border-b border-slate-200/60 pb-10 last:border-0 last:pb-0"
              >
                <h3 className="text-xl font-bold text-slate-950 mb-4 tracking-tight group-hover:text-emerald-700 transition-colors">
                  {faq.q}
                </h3>
                <p className="text-slate-500 text-[15px] leading-relaxed font-medium max-w-lg">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Minimalist & High Contrast - Tighter Padding */}
      <section className="py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-[1440px] mx-auto bg-slate-950 rounded-4xl p-12 sm:p-20 relative overflow-hidden text-center shadow-2xl shadow-slate-200">
          <div className="relative z-10 max-w-2xl mx-auto space-y-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400">
              CORPORATE SERVICES
            </p>
            <h2 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tighter leading-none">
              Bulk supply tailored for your needs.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
              Wholesale pricing and dedicated supply chains for corporate
              clients and distribution.
            </p>
            <div className="pt-4">
              <Link
                href="/bulk-orders"
                className="inline-flex bg-white text-slate-950 hover:bg-emerald-500 hover:text-white px-10 py-4 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg"
              >
                Request Quote
              </Link>
            </div>
          </div>

          {/* Subtle background flair - no heavy shadows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        </div>
      </section>
    </main>
  );
}
