"use client";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    question: "How do I place an order?",
    answer:
      'Browse our products, add items to your cart, then click "Order via WhatsApp". We will confirm your order and arrange delivery.',
  },
  {
    question: "Do you deliver nationwide?",
    answer:
      "Yes, we deliver across Nigeria. Delivery fees vary by location and will be communicated at the time of order confirmation.",
  },
  {
    question: "Are your products NAFDAC certified?",
    answer:
      "All our products comply with Nigerian food safety standards. NAFDAC registration numbers are shown on our products.",
  },
  {
    question: "Are the products natural/organic?",
    answer:
      "Yes. Our products are clean-label with no artificial preservatives, flavours, or MSG. We believe in honest, transparent ingredients.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer, cash on delivery, and POS payment. Payment details are provided after order confirmation on WhatsApp.",
  },
  {
    question: "Can I buy in bulk?",
    answer:
      "Yes! Visit our Bulk Orders page or contact us directly for wholesale pricing, custom packaging, and volume discounts.",
  },
  {
    question: "What is Mervida?",
    answer:
      "Mervida is our product brand. GFO Foods Limited is the company behind it — like YouTube by Google. When you buy a Mervida product, you are buying the quality and trust of GFO Foods Limited.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Within Lagos: 1-2 business days. Outside Lagos: 2-5 business days. We will keep you updated via WhatsApp.",
  },
];

function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/5 border border-slate-100/50">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left px-8 py-6 flex items-center justify-between font-bold text-slate-950 hover:text-emerald-700 transition-colors ${
          open ? "border-b border-slate-50 bg-emerald-50/50" : ""
        }`}
        aria-expanded={open}
      >
        <span className="pr-4 tracking-tight">{question}</span>
        <svg
          className={`w-5 h-5 shrink-0 text-emerald-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {open && (
        <div className="px-8 py-6 bg-slate-50/50">
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="bg-[#faf9f7] min-h-screen">
      {/* Hero */}
      <section className="bg-slate-950 pt-24 pb-20 px-6 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-500 mb-5">
          Support Portal
        </p>
        <h1 className="text-5xl sm:text-6xl font-display font-bold text-white tracking-tighter leading-none">
          Frequently Answered <br className="hidden sm:block" /> Questions
        </h1>
      </section>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-3">
        {FAQS.map((faq) => (
          <AccordionItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>

      {/* Still have questions */}
      <div className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="bg-white rounded-5xl p-12 shadow-2xl shadow-slate-950/5 border border-slate-100/50 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-display font-bold text-slate-950 mb-3 tracking-tight uppercase">
              Still have questions?
            </h2>
            <p className="text-slate-500 font-medium text-sm mb-10 max-w-sm mx-auto">
              Our administrative team is available for direct consultation via
              WhatsApp.
            </p>
            <Link
              href="/contact"
              className="inline-flex h-14 items-center bg-slate-950 hover:bg-emerald-600 text-white px-12 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-950/20"
            >
              Contact Us
            </Link>
          </div>
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
        </div>
      </div>
    </main>
  );
}
