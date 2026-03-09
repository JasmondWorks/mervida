"use client";
import { useState, useEffect } from "react";
import { initStore, getSettings } from "@/app/lib/store";
import { generateId } from "@/app/lib/store";
import {
  initPersonalShoppingStore,
  saveDiasporaRequest,
} from "@/app/lib/personal-shopping-store";
import type { DiasporaRequest } from "@/app/lib/personal-shopping-types";

const COUNTRIES = [
  "🇬🇧 United Kingdom",
  "🇺🇸 United States",
  "🇨🇦 Canada",
  "🇩🇪 Germany",
  "🇫🇷 France",
  "🇮🇹 Italy",
  "🇳🇱 Netherlands",
  "🇦🇺 Australia",
  "🇿🇦 South Africa",
  "Other",
];

const OCCASIONS = [
  "Just Stocking Up",
  "Cooking a Specific Meal",
  "Sending a Gift",
  "Special Occasion (Birthday, Naming Ceremony, etc.)",
];

const URGENCY_OPTIONS = ["No Rush", "Within 2 weeks", "Urgent (within 1 week)"];

const PRODUCT_CATEGORIES = [
  {
    title: "Proteins & Seafood",
    items: [
      "Smoked Catfish (Eja Aro)",
      "Smoked Mackerel",
      "Stockfish (Okporoko)",
      "Dried/Smoked Shrimp (Crayfish)",
      "Ponmo (Cow Skin)",
      "Dried Snail",
    ],
  },
  {
    title: "Soups & Stew Bases",
    items: [
      "Palm Oil (Red Oil)",
      "Egusi (Melon Seeds) — whole and ground",
      "Ogiri / Locust Beans (Iru)",
      "Ofe Akwu / Banga Soup Concentrate",
      "Tomato Paste (Mervida brand)",
    ],
  },
  {
    title: "Grains, Flours & Starches",
    items: [
      "Garri (White & Yellow)",
      "Semovita / Semolina",
      "Plantain Flour",
      "Ofada Rice",
      "Yam Flour (Poundo Yam)",
      "Ede Cocoyam",
    ],
  },
  {
    title: "Spices & Flavour",
    items: [
      "Uziza Leaves (dried)",
      "Utazi Leaves (dried)",
      "Ehuru (Calabash Nutmeg)",
      "Uda (Negro Pepper)",
      "Ochu / Alligator Pepper",
    ],
  },
  {
    title: "Snacks & Comfort",
    items: [
      "Chin Chin",
      "Puff Puff Mix",
      "Nigerian Biscuits",
      "Nkwobi Spice Pack",
      "Suya Spice",
    ],
  },
];

const SHIPPING_COUNTRIES = [
  { flag: "🇬🇧", name: "UK", time: "7–14 business days" },
  { flag: "🇺🇸", name: "USA", time: "10–18 business days" },
  { flag: "🇨🇦", name: "Canada", time: "10–18 business days" },
  { flag: "🇩🇪", name: "Germany", time: "7–14 business days" },
  { flag: "🇫🇷", name: "France", time: "7–14 business days" },
  { flag: "🇮🇹", name: "Italy", time: "10–18 business days" },
  { flag: "🇳🇱", name: "Netherlands", time: "7–14 business days" },
  { flag: "🇦🇺", name: "Australia", time: "14–21 business days" },
  { flag: "🇿🇦", name: "South Africa", time: "10–18 business days" },
];

const GIFT_BUNDLES = [
  {
    name: "The Soup Starter Pack",
    items: "Palm Oil, Egusi, Crayfish, Ogiri, Stockfish",
    price: "From ₦15,000",
  },
  {
    name: "The Full Market Run",
    items: "Customised based on your request",
    price: "Price on request",
  },
  {
    name: "The Nostalgia Hamper",
    items: "Smoked Catfish, Garri, Semovita, Palm Oil, Ogiri, Chin Chin",
    price: "From ₦22,000",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do you package perishable items for international shipping?",
    a: "All items are vacuum-sealed and food-safe packaged. We use insulated containers where needed and ensure everything meets international import standards.",
  },
  {
    q: "Are your products compliant with import regulations in the UK/US/EU?",
    a: "Yes. We ensure that all shipped products comply with the relevant food import regulations for the destination country.",
  },
  {
    q: "How do I track my shipment?",
    a: "Once your order is packed and shipped, we'll send you a tracking number via WhatsApp and email.",
  },
  {
    q: "Can I request items not listed on your website?",
    a: "Absolutely! Just include them in your shopping list and we'll do our best to source them.",
  },
  {
    q: "What if an item is unavailable?",
    a: "We'll contact you on WhatsApp to discuss alternatives before proceeding.",
  },
  {
    q: "Do you offer refunds if items are damaged in transit?",
    a: "Yes. If any item arrives damaged, send us photos and we'll arrange a refund or replacement.",
  },
];

export default function DiasporaShoppingPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [shoppingList, setShoppingList] = useState("");
  const [occasion, setOccasion] = useState("");
  const [specificMeal, setSpecificMeal] = useState("");
  const [urgency, setUrgency] = useState("No Rush");
  const [notes, setNotes] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  useEffect(() => {
    initStore();
    initPersonalShoppingStore();
    const s = getSettings();
    setWhatsappNumber(s.whatsappNumber ?? "");
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const req: DiasporaRequest = {
      id: generateId(),
      fullName,
      email,
      whatsappNumber: whatsapp,
      deliveryCountry: country,
      deliveryAddress: address,
      shoppingList,
      occasion,
      specificMeal,
      urgency,
      additionalNotes: notes,
      isGift,
      recipientName: isGift ? recipientName : "",
      recipientAddress: isGift ? recipientAddress : "",
      giftMessage: isGift ? giftMessage : "",
      status: "new",
      adminNotes: "",
      createdAt: new Date().toISOString(),
    };

    saveDiasporaRequest(req);
    setSubmitted(true);

    // WhatsApp backup
    if (whatsappNumber) {
      const text = `Hello Mervida! 👋 I just submitted a diaspora shopping request. My name is ${fullName} and I'm based in ${country}. Looking forward to hearing from you!`;
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  const inputCls =
    "w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl px-6 py-3.5 text-sm outline-none transition-all placeholder:text-slate-300";
  const selectCls =
    "w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl px-6 py-3.5 text-sm outline-none transition-all text-slate-700 appearance-none";
  const labelCls =
    "block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-1";

  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative bg-mesh-emerald bg-pattern-dark pt-32 pb-28 px-6 text-center rounded-b-[4rem] overflow-hidden">
        <div className="relative z-10 animate-in fade-in slide-in-from-top-8 duration-1000 max-w-3xl mx-auto">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-400 mb-6 px-5 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 w-fit mx-auto">
            Diaspora Shopping
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-white tracking-tighter mb-6 leading-none">
            African Food, Delivered
            <br className="hidden sm:block" /> Anywhere in the World.
          </h1>
          <p className="text-white/70 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Authentically Nigerian. Carefully sourced. Shipped with love.
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-display font-bold text-white/[0.03] pointer-events-none select-none tracking-tighter italic z-0">
          DIASPORA
        </div>
      </section>

      {/* Emotional Story */}
      <section className="max-w-4xl mx-auto px-6 py-24 sm:py-32">
        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 sm:p-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-6">
            Our Story
          </p>
          <blockquote className="text-slate-700 text-lg sm:text-xl leading-relaxed font-medium italic border-l-4 border-emerald-500/30 pl-6">
            For Africans in the diaspora, food is more than nutrition —
            it&apos;s a thread back to everything familiar. The smell of palm
            oil hitting a hot pan. The texture of egusi stirred to just the
            right consistency. The colour of ede cocoyam in a pot of ofe onugbu.
            Mervida exists so that distance never has to mean separation from
            the meals that made you who you are. We source directly from trusted
            Nigerian suppliers, pack with care, and ship to your doorstep — in
            the UK, US, Canada, Germany, or anywhere you&apos;ve made home.
          </blockquote>
        </div>
      </section>

      {/* What We Can Source */}
      <section className="bg-slate-50 border-y border-slate-100 py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
              Extensive Catalogue
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
              What We Can Source
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="bg-white border border-slate-100 rounded-[2rem] p-8"
              >
                <h3 className="text-lg font-display font-bold text-slate-950 mb-4 tracking-tight">
                  {cat.title}
                </h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="text-slate-500 text-sm font-medium flex items-start gap-2"
                    >
                      <span className="text-emerald-500 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="inline-block bg-white border border-slate-200 rounded-full px-8 py-4">
              <p className="text-slate-500 font-bold text-sm">
                Don&apos;t see your item?{" "}
                <span className="text-emerald-600">
                  We&apos;ll try to source it. Just ask.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Countries */}
      <section className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
            Global Reach
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
            Countries We Ship To
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
          {SHIPPING_COUNTRIES.map((c) => (
            <div
              key={c.name}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center hover:border-emerald-500/20 transition-all group"
            >
              <span className="text-3xl block mb-2">{c.flag}</span>
              <p className="text-slate-900 font-bold text-xs">{c.name}</p>
              <p className="text-slate-400 text-[10px] font-medium mt-1">
                {c.time}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 space-y-3">
          <p className="text-slate-400 text-sm font-medium">
            Don&apos;t see your country? Contact us — we may still be able to
            ship.
          </p>
          <p className="text-slate-400 text-xs font-medium italic">
            All items are vacuum-sealed and food-safe packaged to meet
            international import standards.
          </p>
        </div>
      </section>

      {/* Request Form */}
      <section
        id="request-form"
        className="bg-slate-50 border-y border-slate-100 py-24 sm:py-32 px-6"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
              Build Your Diaspora Hamper
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
              Tell Us What You&apos;re Craving
            </h2>
          </div>

          {submitted ? (
            <div className="bg-white border border-emerald-200 rounded-[2rem] p-10 sm:p-14 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-950 mb-4">
                Request Received!
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Thank you! We&apos;ve received your request. Our team will
                contact you on WhatsApp within 24 hours with availability and
                pricing.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-12 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputCls}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className={labelCls}>Your Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={inputCls}
                    placeholder="+44 7..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Delivery Country *</label>
                  <select
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Delivery Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputCls}
                  placeholder="Full address including postcode/zip"
                />
              </div>

              <div>
                <label className={labelCls}>Your Shopping List *</label>
                <textarea
                  required
                  value={shoppingList}
                  onChange={(e) => setShoppingList(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl px-6 py-4 text-sm outline-none transition-all placeholder:text-slate-300 resize-none"
                  placeholder="List everything you need, with quantities where possible. E.g.: 2kg smoked catfish, 5 litres palm oil, 1kg egusi (ground), 500g crayfish..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Occasion / Context</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Select (optional)</option>
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Specific Meal</label>
                  <input
                    type="text"
                    value={specificMeal}
                    onChange={(e) => setSpecificMeal(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Ofe Onugbu with Semovita"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className={selectCls}
                >
                  {URGENCY_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gift Section */}
              <div className="border-t border-slate-100 pt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="w-5 h-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                    🎁 This is a gift — I&apos;m sending a taste of home to
                    someone
                  </span>
                </label>

                {isGift && (
                  <div className="mt-6 space-y-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Recipient Name</label>
                        <input
                          type="text"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className={inputCls}
                          placeholder="Who is this for?"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Recipient Address</label>
                        <input
                          type="text"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          className={inputCls}
                          placeholder="Their delivery address"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Gift Message</label>
                      <textarea
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl px-6 py-4 text-sm outline-none transition-all placeholder:text-slate-300 resize-none"
                        placeholder="We'll print this on a card and include it in the package"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={labelCls}>Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl px-6 py-4 text-sm outline-none transition-all placeholder:text-slate-300 resize-none"
                  placeholder="Special requests, brand preferences, allergies..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-emerald-600 text-white py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95"
              >
                Submit My Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Gift Bundles */}
      <section className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
            Send a Taste of Home as a Gift
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none mb-4">
            Gift the Diaspora
          </h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Know someone in the diaspora who&apos;s been missing home? Send them
            a curated hamper of their favourite Nigerian products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GIFT_BUNDLES.map((b) => (
            <div
              key={b.name}
              className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 sm:p-10 group hover:border-emerald-500/20 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl mb-6">
                🎁
              </div>
              <h3 className="text-xl font-display font-bold text-slate-950 mb-2 tracking-tight">
                {b.name}
              </h3>
              <p className="text-slate-500 text-sm font-medium mb-4 leading-relaxed">
                {b.items}
              </p>
              <p className="text-emerald-600 font-bold text-sm mb-6">
                {b.price}
              </p>
              <a
                href="#request-form"
                className="inline-flex items-center gap-2 bg-slate-950 text-white px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
              >
                Customise & Order
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-950 text-white py-24 sm:py-32 px-6 rounded-t-[4rem] relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-500/60 mb-4">
              Questions?
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter leading-none">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                >
                  <span className="text-white/90 font-bold text-sm">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-white/50 text-sm font-medium leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-display font-bold text-white/[0.02] pointer-events-none select-none tracking-tighter italic z-0">
          FAQ
        </div>
      </section>
    </main>
  );
}
