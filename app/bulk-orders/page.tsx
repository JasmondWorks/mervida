"use client";
import { useEffect, useState } from "react";
import { initStore, getSettings } from "@/app/lib/store";

const BENEFITS = [
  {
    stat: "30%+",
    title: "Better Pricing",
    description:
      "Significant discounts on large orders. The more you buy, the more you save.",
  },
  {
    stat: "100%",
    title: "Custom Packaging",
    description:
      "Private label and custom branding available for your business needs.",
  },
  {
    stat: "24/7",
    title: "Dedicated Supply",
    description:
      "Reliable, consistent supply to keep your business running smoothly.",
  },
];

export default function BulkOrdersPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [products, setProducts] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    initStore();
    const s = getSettings();
    setWhatsappNumber(s.whatsappNumber ?? "");
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!whatsappNumber) return;
    const text = [
      "Hello GFO Foods! I would like to enquire about a bulk order.",
      "",
      `Business Name: ${businessName}`,
      `Contact Name: ${contactName}`,
      `Phone: ${phone}`,
      `Product(s): ${products}`,
      `Estimated Quantity: ${quantity}`,
      message ? `Additional Notes: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const inputCls =
    "w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-full px-6 py-3.5 text-sm outline-none transition-all placeholder:text-slate-300";

  return (
    <main className="bg-white min-h-screen">
      {/* Hero - Engaging Mesh & Pattern */}
      <section className="relative bg-mesh-emerald bg-pattern-dark pt-32 pb-24 px-6 text-center rounded-b-6xl overflow-hidden">
        <div className="relative z-10 animate-in fade-in slide-in-from-top-8 duration-1000">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-400 mb-6 px-5 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 w-fit mx-auto">
            Strategic Partnerships
          </p>
          <h1 className="text-5xl sm:text-7xl font-display font-bold text-white tracking-tighter mb-6 leading-none">
            Bulk Orders.
          </h1>
          <p className="text-white/70 text-base sm:text-xl max-w-xl mx-auto leading-relaxed font-medium">
            Wholesale pricing, custom packaging, and dedicated supply for
            restaurants, distributors, and global businesses.
          </p>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-display font-bold text-white/5 pointer-events-none select-none tracking-tighter italic z-0">
          B2B
        </div>
      </section>

      {/* Benefits - Shadowless, Rounded, Professional */}
      <section className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600">
              The Mervida Advantage
            </p>
            <h2 className="text-4xl font-display font-bold tracking-tighter text-slate-950 uppercase leading-none">
              Why Partner With Us
            </h2>
          </div>
          <p className="text-slate-400 font-medium text-[11px] uppercase tracking-widest max-w-[240px] md:text-right">
            Optimized supply chains for high-volume stakeholders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-slate-50 border border-slate-100 rounded-5xl p-10 group hover:bg-slate-950 transition-all duration-500"
            >
              <p className="text-5xl font-display font-bold text-emerald-500/20 mb-8 transition-colors group-hover:text-emerald-500">
                {b.stat}
              </p>
              <h3 className="text-xl font-display font-bold text-slate-950 mb-4 tracking-tight uppercase group-hover:text-white transition-colors">
                {b.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed text-lg group-hover:text-slate-400 transition-colors">
                {b.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="bg-white border-2 border-slate-50 rounded-5xl p-12 flex flex-col items-center text-center max-w-lg mx-auto hover:border-emerald-500/20 transition-all duration-500">
            <p className="text-5xl font-display font-bold text-emerald-500 mb-6 drop-shadow-sm">
              Any
            </p>
            <h3 className="text-xl font-display font-bold text-slate-950 mb-4 tracking-tight uppercase">
              Flexible Quantities
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed text-lg italic">
              From restaurant-size to full distribution quantities. We
              accommodate all scales.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section className="pb-20 px-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Submit a Bulk Inquiry
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Complete the form and we will respond via WhatsApp with pricing and
            details.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5">
                  Business name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={inputCls}
                  placeholder="Your business name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5">
                  Contact name
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className={inputCls}
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5">
                Phone number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
                placeholder="+234..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5">
                Product(s) interested in
              </label>
              <input
                type="text"
                required
                value={products}
                onChange={(e) => setProducts(e.target.value)}
                className={inputCls}
                placeholder="e.g. Plantain Flour"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5">
                Estimated quantity
              </label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={inputCls}
                placeholder="e.g. 100kg"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5">
                Additional message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-3xl px-6 py-4 text-sm outline-none transition-all placeholder:text-slate-300 resize-none"
                placeholder="Any specific requirements, delivery location, timeline, etc."
              />
            </div>

            <button
              type="submit"
              disabled={!whatsappNumber}
              className={`w-full bg-slate-950 hover:bg-emerald-600 text-white py-4 rounded-full font-semibold text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-black/5 ${
                !whatsappNumber ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {whatsappNumber
                ? "Send Partnership Request"
                : "WhatsApp not configured"}
            </button>
          </form>
        </div>
      </section>

      {/* Distribution Platform Banner */}
      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <a
            href="https://distribute.mervida.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-slate-950 rounded-3xl p-8 sm:p-10 text-center group hover:bg-emerald-900 transition-all duration-500 relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400 mb-3">
                Mervida Distribution
              </p>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight mb-3">
                Looking for our full product range?
              </h3>
              <p className="text-white/50 text-sm font-medium mb-6 max-w-md mx-auto">
                Whether you&apos;re a consumer, retailer, or business — explore
                our distribution platform for product catalogues, pricing, and
                delivery across Nigeria.
              </p>
              <span className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest border border-white/10 group-hover:bg-white group-hover:text-emerald-900 transition-all">
                Visit Mervida Distribute
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-display font-bold text-white/[0.03] pointer-events-none select-none tracking-tighter italic">
              B2B
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
