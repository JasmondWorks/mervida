"use client";
import { useEffect, useState } from "react";
import { initStore, getSettings } from "@/app/lib/store";

export default function ContactPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    initStore();
    const s = getSettings();
    setWhatsappNumber(s.whatsappNumber ?? "");
    setBusinessEmail(s.businessEmail ?? "");
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!whatsappNumber) return;
    const text = `Hello from ${name} (${email}):\n\n${message}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="bg-[#faf9f7] min-h-screen">
      {/* Hero header */}
      <section className="bg-slate-950 pt-24 pb-20 px-6 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-500 mb-5">
          Get in Touch
        </p>
        <h1 className="text-5xl sm:text-6xl font-display font-bold text-white tracking-tighter">
          Contact Us
        </h1>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Contact info — no card wrapper */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-10">
            Contact Information
          </p>

          {/* Location */}
          <div className="flex items-start gap-5 mb-8">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100/50">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                Office Location
              </p>
              <p className="text-slate-900 font-medium text-lg">
                Lagos, Nigeria
              </p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-start gap-5 mb-8">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100/50">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                WhatsApp Direct
              </p>
              {whatsappNumber ? (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-900 font-medium text-lg hover:text-emerald-700 transition-colors"
                >
                  +{whatsappNumber}
                </a>
              ) : (
                <p className="text-slate-400 font-medium text-lg">
                  Not configured
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          {businessEmail && (
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100/50">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                  Email Inquiry
                </p>
                <a
                  href={`mailto:${businessEmail}`}
                  className="text-slate-900 font-medium text-lg hover:text-emerald-700 transition-colors"
                >
                  {businessEmail}
                </a>
              </div>
            </div>
          )}

          {/* WhatsApp CTA */}
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950 hover:bg-emerald-600 text-white w-full text-center py-5 rounded-full font-bold text-[11px] uppercase tracking-widest mt-12 block transition-all active:scale-95 shadow-xl shadow-slate-950/5"
            >
              Start Instant Conversation
            </a>
          )}
        </div>

        {/* Right: Form */}
        <div className="bg-white rounded-5xl p-10 shadow-2xl shadow-slate-950/5 border border-slate-100">
          <h2 className="text-xl font-display font-bold text-slate-950 mb-2 tracking-tight">
            Direct Messaging
          </h2>
          <p className="text-slate-500 font-medium text-sm mb-10">
            Send a priority brief for administrative review.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5"
              >
                Your nomenclature
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-full px-6 py-3.5 text-sm outline-none transition-all placeholder:text-slate-300"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5"
              >
                Contact email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-full px-6 py-3.5 text-sm outline-none transition-all placeholder:text-slate-300"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5"
              >
                Message scope
              </label>
              <textarea
                id="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-3xl px-6 py-4 text-sm outline-none transition-all resize-none placeholder:text-slate-300"
                placeholder="Describe your requirements..."
              />
            </div>
            <button
              type="submit"
              disabled={!whatsappNumber}
              className={`w-full bg-slate-950 hover:bg-emerald-600 text-white py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-950/5 ${
                !whatsappNumber ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {whatsappNumber
                ? "Transmit via WhatsApp"
                : "WhatsApp not configured"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
