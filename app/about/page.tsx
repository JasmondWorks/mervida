"use client";
import Link from "next/link";

const PROMISES = [
  {
    num: "01",
    title: "Clean Label",
    description:
      "No artificial preservatives, no MSG, no artificial flavours. What you see on the label is exactly what is in the package.",
  },
  {
    num: "02",
    title: "Premium Quality",
    description:
      "Every product is carefully sourced and processed to the highest standard. We never compromise on quality.",
  },
  {
    num: "03",
    title: "Nigerian Heritage",
    description:
      "We celebrate Nigeria's rich food culture by making traditional ingredients accessible, convenient, and trustworthy.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen pt-32 pb-32 max-w-[1440px] mx-auto animate-in fade-in duration-1000">
      {/* Hero section - Engaging Pattern Background */}
      <section className="px-6 sm:px-12 pb-24 border-b border-slate-50 flex flex-col lg:flex-row lg:items-end justify-between gap-12 bg-pattern-subtle rounded-t-6xl pt-12">
        <div className="space-y-6">
          <nav className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-8 font-display flex items-center gap-3">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <span className="opacity-20 text-[8px]">/</span>
            <span className="text-slate-900 border-b border-emerald-500/30 pb-0.5 font-bold">
              About Story
            </span>
          </nav>
          <h1 className="text-5xl sm:text-7xl font-display font-bold tracking-tighter text-slate-950 leading-[0.85] max-w-xl">
            Our Mission.
            <br />
            Natural Quality.
          </h1>
          <p className="text-slate-500 font-medium text-lg sm:text-xl max-w-sm leading-relaxed">
            A commitment to the finest natural ingredients from Nigeria, crafted
            for every kitchen.
          </p>
        </div>

        {/* Identity section - tight but readable */}
        <div className="max-w-md space-y-6 pt-12 border-t border-slate-50 lg:border-none lg:pt-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-2">
            Our Identity
          </p>
          <p className="text-slate-500 font-medium leading-loose text-lg">
            GFO FOODS LIMITED is a premium food and wellness company dedicated
            to bringing you the finest natural ingredients from Nigeria and
            across Africa. We believe that what you eat should nourish your
            body—which is why everything we make is clean-label and honest.
          </p>
        </div>
      </section>

      {/* Brand card - Large Rounding - Premium UI */}
      <section className="py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-6xl overflow-hidden border border-slate-100 shadow-2xl shadow-slate-900/2">
          <div className="p-12 sm:p-24 bg-slate-950 text-white flex flex-col justify-center space-y-10 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <p className="text-[10px] font-bold tracking-[0.4em] text-emerald-400 uppercase">
                Core Persona
              </p>
              <h2 className="text-5xl sm:text-6xl font-display font-bold tracking-tighter leading-[0.9]">
                What is
                <br />
                Mervida?
              </h2>
              <div className="text-slate-400 font-medium leading-[1.9] space-y-8 max-w-md pt-4 text-lg">
                <p>
                  Mervida is our consumer product brand—the face that meets you
                  in every kitchen. GFO Foods Limited is the overarching company
                  that handles the curation, but Mervida is the soul of our
                  product line.
                </p>
                <div className="text-white border-l-2 border-emerald-500 pl-8 py-1 italic font-display text-xl leading-relaxed tracking-tight">
                  "The Mervida name stands for something we deeply believe in:
                  natural goodness delivered with premium quality."
                </div>
              </div>
            </div>
            {/* Subtle background element */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
          </div>
          <div className="bg-slate-50 flex items-center justify-center p-24 group overflow-hidden">
            <div className="relative">
              <div className="text-[12rem] font-display font-bold text-slate-200 select-none opacity-20 transform -rotate-12 transition-transform duration-1000 group-hover:rotate-0 group-hover:scale-110">
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
      <section className="py-32 max-w-5xl mx-auto text-center border-t border-slate-50">
        <div className="inline-flex items-center gap-4 bg-slate-50 px-6 py-2 rounded-full border border-slate-100 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-12">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Founding Vision
        </div>
        <h3 className="text-5xl sm:text-7xl font-display font-bold text-slate-950 mb-10 tracking-tighter leading-none">
          Mrs. Victoria Olorede
        </h3>
        <p className="text-slate-500 leading-[2] text-xl sm:text-2xl font-medium max-w-2xl mx-auto tracking-tight">
          A passionate advocate for natural, healthy food and Nigerian culinary
          heritage, Mrs. Olorede founded GFO Foods Limited to give every family
          access to premium, clean-label food products they can trust.
        </p>
      </section>

      {/* Promises - Modern Containers */}
      <section className="py-32 border-t border-slate-50">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 px-4">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600">
              The Mervida Ethos
            </p>
            <h2 className="text-4xl font-display font-bold tracking-tighter text-slate-950 uppercase leading-none">
              Our Commitment
            </h2>
          </div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest max-w-[200px] md:text-right">
            A triad of values that define every product we release.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {PROMISES.map((promise) => (
            <div
              key={promise.title}
              className="p-12 bg-white border border-slate-100 rounded-5xl hover:bg-slate-50 hover:border-emerald-500/30 transition-all duration-500 group cursor-default"
            >
              <p className="text-5xl font-display font-bold text-slate-100 mb-10 group-hover:text-emerald-500/20 transition-colors leading-none tracking-tighter">
                {promise.num}
              </p>
              <h3 className="text-xl font-display font-bold text-slate-950 mb-4 tracking-tight uppercase group-hover:text-emerald-700 transition-colors">
                {promise.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed text-lg group-hover:text-slate-600 transition-colors">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* High-Impact CTA - Rounded Aesthetic */}
      <section className="bg-emerald-700 py-32 px-10 text-center rounded-6xl relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <h2 className="text-6xl sm:text-8xl font-display font-bold text-white tracking-tighter leading-[0.8] drop-shadow-sm">
            Taste The
            <br />
            Story.
          </h2>
          <div className="pt-6">
            <Link
              href="/products"
              className="inline-flex h-16 items-center bg-white text-emerald-900 hover:bg-slate-950 hover:text-white px-16 rounded-full font-bold text-[12px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl shadow-emerald-950/20"
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
