"use client";
import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Tell us what you need",
    text: "Fill in our request form or send us a WhatsApp message with your shopping list.",
  },
  {
    num: "02",
    title: "We source and confirm",
    text: "Our team finds everything on your list and sends you a price confirmation.",
  },
  {
    num: "03",
    title: "You approve and pay",
    text: "Confirm the items and pay via your preferred method.",
  },
  {
    num: "04",
    title: "We pack and deliver",
    text: "Items are carefully packed and shipped or delivered to your address.",
  },
];

const TESTIMONIALS = [
  {
    text: "I hadn't tasted ede cocoyam soup since I moved to Germany in 2019. Mervida sent me everything I needed — even the uziza leaves.",
    name: "Chisom",
    location: "Berlin",
  },
  {
    text: "My 78-year-old mother can't walk to the market anymore. Mervida shops for her weekly. It's been a lifesaver.",
    name: "Emeka",
    location: "Lagos",
  },
  {
    text: "I sent a taste-of-home hamper to my sister in Canada for her birthday. She cried tears of joy. Mervida made it seamless.",
    name: "Adaeze",
    location: "London",
  },
];

const DIASPORA_PRODUCTS = [
  { name: "Smoked Catfish", emoji: "🐟" },
  { name: "Palm Oil", emoji: "🫒" },
  { name: "Egusi (Melon Seeds)", emoji: "🌿" },
  { name: "Ogiri / Locust Beans", emoji: "🫘" },
  { name: "Stockfish", emoji: "🐠" },
  { name: "Ede (Cocoyam)", emoji: "🥔" },
  { name: "Uziza Leaves", emoji: "🍃" },
  { name: "Crayfish", emoji: "🦐" },
];

export default function PersonalShoppingPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative bg-mesh-emerald bg-pattern-dark pt-32 pb-28 px-6 text-center rounded-b-[4rem] overflow-hidden">
        <div className="relative z-10 animate-in fade-in slide-in-from-top-8 duration-1000 max-w-3xl mx-auto">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-400 mb-6 px-5 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 w-fit mx-auto">
            Personal Shopping
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-white tracking-tighter mb-6 leading-none">
            Home is a Meal Away.
          </h1>
          <p className="text-white/70 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium mb-10">
            Whether you&apos;re miles from Nigeria or need a helping hand,
            Mervida brings the taste of home to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/personal-shopping/diaspora"
              className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-400 hover:text-slate-950 transition-all active:scale-95"
            >
              Shop for the Diaspora
            </Link>
            <Link
              href="/personal-shopping/elder-care"
              className="bg-white/10 text-white px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all active:scale-95 backdrop-blur-md"
            >
              Elder Care Shopping
            </Link>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-display font-bold text-white/[0.03] pointer-events-none select-none tracking-tighter italic z-0">
          PS
        </div>
      </section>

      {/* Service Cards */}
      <section className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
            Two Services, One Heart
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
            How Can We Help You?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 — Diaspora */}
          <div className="group bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 sm:p-12 hover:bg-slate-950 transition-all duration-500 flex flex-col">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-3xl mb-8 group-hover:bg-emerald-500/20 transition-all">
              🌍
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-950 mb-4 tracking-tight group-hover:text-white transition-colors">
              Missing Home?
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8 group-hover:text-slate-400 transition-colors flex-1">
              We source authentic Nigerian and African food products and ship
              them directly to you — wherever you are in the world. From smoked
              catfish to palm oil, egusi to uziza leaves.
            </p>
            <Link
              href="/personal-shopping/diaspora"
              className="inline-flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 w-fit group-hover:bg-emerald-600"
            >
              Start Your Diaspora Order
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
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          {/* Card 2 — Elder Care */}
          <div className="group bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 sm:p-12 hover:bg-slate-950 transition-all duration-500 flex flex-col">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-3xl mb-8 group-hover:bg-emerald-500/20 transition-all">
              🤝
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-950 mb-4 tracking-tight group-hover:text-white transition-colors">
              Shopping Made Easy for the Elderly
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8 group-hover:text-slate-400 transition-colors flex-1">
              We personally shop for elderly loved ones who need assistance —
              fresh produce, pantry staples, specialty items, all delivered with
              care and patience.
            </p>
            <Link
              href="/personal-shopping/elder-care"
              className="inline-flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 w-fit group-hover:bg-emerald-600"
            >
              Request Elder Care Shopping
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
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 border-y border-slate-100 py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
              Simple Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-white border border-slate-100 rounded-[2rem] p-8 group hover:border-emerald-500/20 transition-all duration-300"
              >
                <p className="text-4xl font-display font-bold text-emerald-500/20 mb-6 group-hover:text-emerald-500 transition-colors">
                  {step.num}
                </p>
                <h3 className="text-lg font-display font-bold text-slate-950 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
            Stories from Our Community
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
            Real Experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 sm:p-10"
            >
              <div className="text-emerald-500 mb-6">
                <svg
                  className="w-8 h-8 opacity-30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed mb-8 italic text-[15px]">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs font-medium">
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Diaspora Products */}
      <section className="bg-slate-950 text-white py-24 sm:py-32 px-6 rounded-t-[4rem] relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-500/60 mb-4">
              Diaspora Favourites
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter leading-none">
              Popular Products
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {DIASPORA_PRODUCTS.map((p) => (
              <div
                key={p.name}
                className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 text-center hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              >
                <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">
                  {p.emoji}
                </span>
                <p className="text-white/80 font-bold text-[12px] tracking-wide">
                  {p.name}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products?tag=diaspora"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all"
            >
              See all diaspora-favourite products
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
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[35vw] font-display font-bold text-white/[0.02] pointer-events-none select-none tracking-tighter italic z-0">
          HOME
        </div>
      </section>
    </main>
  );
}
