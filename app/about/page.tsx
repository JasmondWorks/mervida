"use client";
import Link from "next/link";

const PROMISES = [
  {
    num: "01",
    title: "Freedom from Artificial Foods",
    description:
      "Eliminating synthetic MSG, chemical preservatives, hydrogenated shortenings, and artificial dyes so African families never have to rely on ultra-processed foods.",
  },
  {
    num: "02",
    title: "Authentic African Sourcing",
    description:
      "Directly sourcing 100% natural agricultural produce from Nigerian farms, protecting local ecosystems and ensuring complete origin transparency.",
  },
  {
    num: "03",
    title: "Clean-Label Processing",
    description:
      "Using cold expeller pressing, traditional hygienic fermentation, and stone milling to preserve real nutrients without chemical bleaching or solvents.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen pt-32 pb-32 max-w-[1440px] mx-auto animate-in fade-in duration-1000">
      {/* Hero section - Engaging Pattern Background */}
      <section className="px-6 sm:px-12 pb-24 border-b border-slate-50 flex flex-col lg:flex-row lg:items-end justify-between gap-12 bg-pattern-subtle rounded-t-6xl pt-12">
        <div className="space-y-6">
          <nav className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 mb-8 font-display flex items-center gap-3">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <span className="opacity-20 text-[8px]">/</span>
            <span className="text-slate-900 border-b border-emerald-500/30 pb-0.5 font-bold">
              About Story
            </span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-slate-950 leading-tight max-w-xl">
            Pure Food
            <br />
            Sovereignty.
          </h1>
          <p className="text-slate-500 font-normal text-base sm:text-lg max-w-sm leading-relaxed">
            Reclaiming African health by sourcing and processing 100% natural, chemical-free food products.
          </p>
        </div>

        {/* Identity section - tight but readable */}
        <div className="max-w-md space-y-4 pt-12 border-t border-slate-50 lg:border-none lg:pt-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-2">
            Our Core Mission
          </p>
          <p className="text-slate-600 font-normal leading-relaxed text-base">
            GFO FOODS LIMITED exists to end the dependency on ultra-processed, artificially modified foods in Africa and the diaspora. We source, cold-press, and hygienically process 100% clean-label African staples, baking ingredients, and pure botanical extracts.
          </p>
        </div>
      </section>

      {/* Brand card - Large Rounding - Premium UI */}
      <section className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-6xl overflow-hidden border border-slate-100 shadow-2xl shadow-slate-900/2">
          <div className="p-10 sm:p-16 bg-slate-950 text-white flex flex-col justify-center space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] font-bold tracking-[0.4em] text-emerald-400 uppercase">
                Core Persona
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight leading-tight">
                What is
                <br />
                Mervida?
              </h2>
              <div className="text-slate-400 font-normal leading-relaxed space-y-6 max-w-md pt-2 text-base">
                <p>
                  Mervida is our consumer product brand—the face that meets you
                  in every kitchen. GFO Foods Limited is the overarching company
                  that handles the curation, but Mervida is the soul of our
                  product line.
                </p>
                <div className="text-white border-l border-emerald-500 pl-6 py-1 italic font-display text-lg leading-relaxed tracking-tight">
                  "The Mervida name stands for something we deeply believe in:
                  natural goodness delivered with premium quality."
                </div>
              </div>
            </div>
            {/* Subtle background element */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
          </div>
          <div className="bg-slate-50 flex items-center justify-center p-16 sm:p-24 group overflow-hidden">
            <div className="relative">
              <div className="text-7xl sm:text-9xl font-display font-bold text-slate-200 select-none opacity-20 transform -rotate-12 transition-transform duration-1000 group-hover:rotate-0 group-hover:scale-110">
                MERVIDA
              </div>
              <div className="absolute inset-x-0 bottom-0 text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Registered Trademark
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="py-24 max-w-4xl mx-auto text-center border-t border-slate-50">
        <div className="inline-flex items-center gap-4 bg-slate-50 px-6 py-2 rounded-lg border border-slate-100 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-8">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Founding Vision
        </div>
        <h3 className="text-3xl sm:text-4xl font-display font-bold text-slate-950 mb-6 tracking-tight leading-tight">
          Mrs. Victoria Olorede
        </h3>
        <p className="text-slate-600 leading-relaxed text-base sm:text-lg font-normal max-w-2xl mx-auto tracking-tight">
          A passionate advocate for natural, healthy food and Nigerian culinary
          heritage, Mrs. Olorede founded GFO Foods Limited to give every family
          access to premium, clean-label food products they can trust.
        </p>
      </section>

      {/* Promises - Modern Containers */}
      <section className="py-24 border-t border-slate-50">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 px-4">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600">
              The Mervida Ethos
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-slate-950 uppercase leading-none">
              Our Commitment
            </h2>
          </div>
          <p className="text-slate-400 font-semibold text-[11px] uppercase tracking-widest max-w-[200px] md:text-right">
            A triad of values that define every product we release.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {PROMISES.map((promise) => (
            <div
              key={promise.title}
              className="p-8 sm:p-10 bg-white border border-slate-100 rounded-5xl hover:bg-slate-50 hover:border-emerald-500/30 transition-all duration-500 group cursor-default"
            >
              <p className="text-4xl font-display font-bold text-slate-100 mb-6 group-hover:text-emerald-500/20 transition-colors leading-none tracking-tight">
                {promise.num}
              </p>
              <h3 className="text-base font-display font-bold text-slate-950 mb-3 tracking-tight uppercase group-hover:text-emerald-700 transition-colors">
                {promise.title}
              </h3>
              <p className="text-slate-500 font-normal leading-relaxed text-sm group-hover:text-slate-600 transition-colors">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* High-Impact CTA - Rounded Aesthetic */}
      <section className="bg-emerald-700 py-24 px-10 text-center rounded-6xl relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight leading-tight drop-shadow-sm">
            Taste The
            <br />
            Story.
          </h2>
          <div className="pt-4">
            <Link
              href="/products"
              className="inline-flex h-12 items-center bg-white text-emerald-900 hover:bg-slate-950 hover:text-white px-10 rounded-lg font-bold text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-emerald-950/20"
            >
              Explore Collection
            </Link>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl -ml-32 -mb-32" />
      </section>
    </main>
  );
}
