"use client";
import { useState, useEffect } from "react";
import { generateId } from "@/app/lib/store";
import { fetchSettings } from "@/app/lib/api-client";
import {
  initPersonalShoppingStore,
  saveElderCareRegistration,
} from "@/app/lib/personal-shopping-store";
import type { ElderCareRegistration } from "@/app/lib/personal-shopping-types";

const SERVICE_ICONS = {
  cart: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.705 2.602-7.189.114-.47-.251-.961-.735-.961H5.106M7.5 14.25L5.106 5.272M7.5 14.25l-1.323 2.145c-.35.567.055 1.302.72 1.302h11.925a2.25 2.25 0 100-4.5H7.5z",
  leaf: "M12 21a9 9 0 01-9-9c0-3.5 2-6.5 5-8a9 9 0 017.5 2.5c1 1.5 1.5 3.5 1.5 5.5a9 9 0 01-5 9zM9 15c1-2 3-3 6-3",
  pill: "M9.75 9.75l4.5 4.5m-7.682-1.318a4.5 4.5 0 116.364-6.364l6.364 6.364a4.5 4.5 0 11-6.364 6.364l-6.364-6.364z",
  bottle: "M9.75 2.25h4.5m-4.5 0v3.879a1.5 1.5 0 01-.44 1.06L7.5 8.5a3 3 0 00-.88 2.122V18.75A2.25 2.25 0 008.87 21h6.26a2.25 2.25 0 002.25-2.25v-8.128a3 3 0 00-.88-2.122l-1.81-1.31a1.5 1.5 0 01-.44-1.06V2.25m-4.5 0h4.5",
  box: "M20.25 7.5l-8.25 4.5-8.25-4.5m16.5 0l-8.25-4.5-8.25 4.5m16.5 0v9l-8.25 4.5m-8.25-4.5v-9m8.25 13.5l-8.25-4.5",
  chat: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z",
} as const;

const SERVICES = [
  {
    icon: SERVICE_ICONS.cart,
    title: "Weekly / Monthly Market Runs",
    text: "Give us a recurring list and we'll shop on schedule.",
  },
  {
    icon: SERVICE_ICONS.leaf,
    title: "Fresh Produce & Ingredients",
    text: "Tomatoes, pepper, onions, ede, bitter leaf, ugwu — all fresh.",
  },
  {
    icon: SERVICE_ICONS.pill,
    title: "Pharmacy Pickups",
    text: "We can collect prescriptions or over-the-counter items.",
  },
  {
    icon: SERVICE_ICONS.bottle,
    title: "Household Staples",
    text: "Soap, washing powder, cooking oil — anything on the list.",
  },
  {
    icon: SERVICE_ICONS.box,
    title: "Specialist Items",
    text: "Hard-to-find ingredients, specific brands, specialty health foods.",
  },
  {
    icon: SERVICE_ICONS.chat,
    title: "Personal Communication",
    text: "We call before shopping to confirm and after delivery to check.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Sign Up / Register",
    text: "Fill in our form with the elderly person's name, address, and contact info.",
  },
  {
    num: "02",
    title: "Share the Shopping List",
    text: "Submit weekly via WhatsApp, call, or form. Family members can submit on their behalf.",
  },
  {
    num: "03",
    title: "We Confirm & Shop",
    text: "We call to confirm the list before shopping — no surprises.",
  },
  {
    num: "04",
    title: "We Deliver with Care",
    text: "Our delivery person calls ahead, arrives on time, and helps bring items inside.",
  },
  {
    num: "05",
    title: "You Pay Your Way",
    text: "Family members can pay remotely; elderly person can pay cash on delivery.",
  },
];

const TRUST_SIGNALS = [
  "All our personal shoppers are background-checked and trained in elderly care communication.",
  "We confirm every order before shopping and every delivery before arrival.",
  "If an item isn't available, we call to discuss substitutions — we never substitute without asking.",
];

const FAQ_ITEMS = [
  {
    q: "Can my parent submit their list directly by phone?",
    a: "Yes! They can call or WhatsApp us directly. We're happy to take phone orders and process them personally.",
  },
  {
    q: "What if they're not home at the time of delivery?",
    a: "We always call ahead to confirm. If plans change, we reschedule at no extra cost.",
  },
  {
    q: "Can you do same-day shopping?",
    a: "In most cases, yes — subject to availability. We recommend submitting lists at least a day in advance for best results.",
  },
  {
    q: "What happens if a price changes between the list submission and shopping?",
    a: "We'll contact you before completing the purchase if prices differ significantly from expectations.",
  },
  {
    q: "Is there a subscription / monthly fee for the service?",
    a: "No monthly fees. You only pay for the items we purchase plus a small service and delivery fee.",
  },
  {
    q: "What areas do you cover for elder care delivery?",
    a: "We currently cover Lagos and surrounding areas. Contact us to check your specific location.",
  },
];

const RELATIONSHIPS = ["Son/Daughter", "Spouse", "Sibling", "Carer", "Other"];
const AGE_RANGES = ["60–70", "71–80", "81–90", "90+"];
const FREQUENCIES = ["Weekly", "Bi-weekly", "Monthly", "One-off"];
const DELIVERY_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DELIVERY_TIMES = [
  "Morning (8am–12pm)",
  "Afternoon (12pm–4pm)",
  "Evening (4pm–7pm)",
];

export default function ElderCareShoppingPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form state
  const [guardianName, setGuardianName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [elderlyName, setElderlyName] = useState("");
  const [elderlyPhone, setElderlyPhone] = useState("");
  const [elderlyAddress, setElderlyAddress] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [mobilityNotes, setMobilityNotes] = useState("");
  const [frequency, setFrequency] = useState("Weekly");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentContact, setPaymentContact] = useState("family");
  const [additionalNotes, setAdditionalNotes] = useState("");

  useEffect(() => {
    initPersonalShoppingStore();
    fetchSettings().then((s) => setWhatsappNumber(s.whatsappNumber ?? ""));
  }, []);

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const reg: ElderCareRegistration = {
      id: generateId(),
      guardianName,
      relationship,
      guardianPhone,
      guardianEmail,
      elderlyName,
      elderlyPhone,
      elderlyAddress,
      ageRange,
      mobilityNotes,
      shoppingFrequency: frequency,
      preferredDeliveryDays: selectedDays,
      preferredDeliveryTime: deliveryTime,
      paymentContact,
      additionalNotes,
      status: "active",
      nextDelivery: "",
      adminNotes: "",
      createdAt: new Date().toISOString(),
    };

    saveElderCareRegistration(reg);
    setSubmitted(true);

    if (whatsappNumber) {
      const text = `Hello Mervida! 👋 I just registered for Elder Care Shopping. I'm ${guardianName} and I'd like to set up shopping for ${elderlyName}. Looking forward to hearing from you!`;
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-400 mb-6 px-5 py-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 w-fit mx-auto">
            Elder Care Shopping
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-white tracking-tighter mb-6 leading-none">
            We Shop So They
            <br className="hidden sm:block" /> Don&apos;t Have To.
          </h1>
          <p className="text-white/70 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            A trusted, regular shopping service for elderly loved ones — fresh,
            accurate, and delivered with patience.
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-display font-bold text-white/[0.03] pointer-events-none select-none tracking-tighter italic z-0">
          CARE
        </div>
      </section>

      {/* Who This Is For */}
      <section className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
            Who This Is For
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
            Built Around Understanding
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 sm:p-12">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.964 0a9 9 0 10-11.964 0m11.964 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-950 mb-6 tracking-tight">
              For the Elderly Person
            </h3>
            <ul className="space-y-4">
              {[
                "You find it difficult to go to the market or navigate online shopping",
                "You want fresh, specific ingredients — not just whatever is easy to find",
                "You want someone you can call and trust",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-slate-600 text-sm font-medium leading-relaxed"
                >
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 sm:p-12">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M15 15.75a4.5 4.5 0 10-5.733-6.933M8.625 15.75a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-950 mb-6 tracking-tight">
              For the Family Member
            </h3>
            <ul className="space-y-4">
              {[
                "You want peace of mind that your parent or relative is well-stocked with everything they need",
                "You live far away (another state or abroad) and can't shop for them yourself",
                "You want a recurring, reliable service",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-slate-600 text-sm font-medium leading-relaxed"
                >
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What We Help With */}
      <section className="bg-slate-50 border-y border-slate-100 py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
              Comprehensive Service
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
              What We Help With
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white border border-slate-100 rounded-[2rem] p-8 group hover:border-emerald-500/20 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-display font-bold text-slate-950 mb-2 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="text-center mb-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
            Step by Step
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
            How the Service Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 group hover:bg-slate-950 transition-all duration-500"
            >
              <p className="text-3xl font-display font-bold text-emerald-500/20 mb-4 group-hover:text-emerald-500 transition-colors">
                {step.num}
              </p>
              <h3 className="text-sm font-display font-bold text-slate-950 mb-2 tracking-tight uppercase group-hover:text-white transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed group-hover:text-slate-400 transition-colors">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Form */}
      <section
        id="register-form"
        className="bg-slate-50 border-y border-slate-100 py-24 sm:py-32 px-6"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
              Get Started
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
              Set Up Elder Care Shopping
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
                Registration Complete!
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Thank you! A member of our team will call within 24 hours to
                confirm the first shopping schedule.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-12 space-y-8"
            >
              {/* Guardian Info */}
              <div>
                <h3 className="text-lg font-display font-bold text-slate-950 mb-6 tracking-tight flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 text-xs font-bold">
                    1
                  </span>
                  About You (Family Member / Guardian)
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Your Name *</label>
                      <input
                        type="text"
                        required
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        className={inputCls}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Relationship *</label>
                      <select
                        required
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className={selectCls}
                      >
                        <option value="">Select relationship</option>
                        {RELATIONSHIPS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>
                        Your Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                        className={inputCls}
                        placeholder="+234..."
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Your Email *</label>
                      <input
                        type="email"
                        required
                        value={guardianEmail}
                        onChange={(e) => setGuardianEmail(e.target.value)}
                        className={inputCls}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Elderly Person Info */}
              <div className="border-t border-slate-100 pt-8">
                <h3 className="text-lg font-display font-bold text-slate-950 mb-6 tracking-tight flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 text-xs font-bold">
                    2
                  </span>
                  About the Elderly Person
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Their Full Name *</label>
                      <input
                        type="text"
                        required
                        value={elderlyName}
                        onChange={(e) => setElderlyName(e.target.value)}
                        className={inputCls}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Their Phone Number</label>
                      <input
                        type="tel"
                        value={elderlyPhone}
                        onChange={(e) => setElderlyPhone(e.target.value)}
                        className={inputCls}
                        placeholder="If they have one"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Their Delivery Address *</label>
                    <input
                      type="text"
                      required
                      value={elderlyAddress}
                      onChange={(e) => setElderlyAddress(e.target.value)}
                      className={inputCls}
                      placeholder="Full address"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Age Range</label>
                      <select
                        value={ageRange}
                        onChange={(e) => setAgeRange(e.target.value)}
                        className={selectCls}
                      >
                        <option value="">Select age range</option>
                        {AGE_RANGES.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        Mobility / Special Notes
                      </label>
                      <input
                        type="text"
                        value={mobilityNotes}
                        onChange={(e) => setMobilityNotes(e.target.value)}
                        className={inputCls}
                        placeholder='e.g. "Uses a walking frame"'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="border-t border-slate-100 pt-8">
                <h3 className="text-lg font-display font-bold text-slate-950 mb-6 tracking-tight flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 text-xs font-bold">
                    3
                  </span>
                  Shopping Preferences
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Shopping Frequency</label>
                      <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className={selectCls}
                      >
                        {FREQUENCIES.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        Preferred Delivery Time
                      </label>
                      <select
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className={selectCls}
                      >
                        <option value="">Select time window</option>
                        {DELIVERY_TIMES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      Preferred Delivery Day(s)
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {DELIVERY_DAYS.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest border transition-all ${
                            selectedDays.includes(day)
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-slate-50 text-slate-500 border-slate-200 hover:border-emerald-500"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      Who Should We Contact for Payment?
                    </label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentContact === "elderly"}
                          onChange={() => setPaymentContact("elderly")}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          The elderly person (cash on delivery)
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentContact === "family"}
                          onChange={() => setPaymentContact("family")}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          Family member (remote payment)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Additional Notes</label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl px-6 py-4 text-sm outline-none transition-all placeholder:text-slate-300 resize-none"
                      placeholder="Any other information we should know..."
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-emerald-600 text-white py-4 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95"
              >
                Register for Elder Care Shopping
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="max-w-4xl mx-auto px-6 py-24 sm:py-32">
        <div className="text-center mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
            Our Promise
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tighter text-slate-950 leading-none">
            Trust & Reliability
          </h2>
        </div>

        <div className="space-y-4">
          {TRUST_SIGNALS.map((signal) => (
            <div
              key={signal}
              className="bg-slate-50 border border-slate-100 rounded-2xl px-8 py-6 flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75"
                  />
                </svg>
              </div>
              <p className="text-slate-700 font-medium text-sm leading-relaxed">
                {signal}
              </p>
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
