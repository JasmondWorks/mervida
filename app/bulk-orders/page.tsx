"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSettings } from "@/app/lib/api-client";
import { Button, Field } from "@/app/components/ui";

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
    fetchSettings().then((s) => setWhatsappNumber(s.whatsappNumber ?? ""));
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

  return (
    <main className="bg-white min-h-screen">
      {/* Hero - Engaging Mesh & Pattern */}
      <section className="relative bg-mesh-emerald bg-pattern-dark pt-32 pb-24 px-6 text-center rounded-b-6xl overflow-hidden">
        <div className="relative z-10 animate-in fade-in slide-in-from-top-8 duration-1000">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-400 mb-4 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 w-fit mx-auto">
            Strategic Partnerships
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Bulk Orders
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal">
            Wholesale pricing, custom packaging, and dedicated supply for
            restaurants, distributors, and global businesses.
          </p>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-extrabold text-white/5 pointer-events-none select-none tracking-tighter italic z-0">
          B2B
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Clean-Label Sourcing
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Why partner with us
            </h2>
          </div>
          <p className="text-sm font-normal text-slate-500 max-w-sm md:text-right leading-relaxed">
            Optimized supply chains and pure natural ingredients for commercial kitchens, retailers, and food manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-slate-50 border border-slate-100 rounded-5xl p-8 sm:p-10 group hover:bg-slate-950 transition-all duration-500"
            >
              <p className="text-4xl font-extrabold text-emerald-500/30 mb-6 transition-colors group-hover:text-emerald-400">
                {b.stat}
              </p>
              <h3 className="text-base font-semibold text-slate-950 mb-2 tracking-tight group-hover:text-white transition-colors">
                {b.title}
              </h3>
              <p className="text-slate-500 font-normal leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
                {b.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="bg-white border-2 border-slate-50 rounded-5xl p-8 sm:p-10 flex flex-col items-center text-center max-w-lg mx-auto hover:border-emerald-500/20 transition-all duration-500">
            <p className="text-4xl font-extrabold text-emerald-600 mb-4">
              Any Scale
            </p>
            <h3 className="text-base font-semibold text-slate-950 mb-2 tracking-tight">
              Flexible Quantities
            </h3>
            <p className="text-slate-500 font-normal leading-relaxed text-sm">
              From restaurant-size portions to full commercial distribution quantities. We
              accommodate all scales with consistent purity.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section className="pb-20 px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg max-w-2xl mx-auto border border-slate-100">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-1.5 tracking-tight">
            Submit a Bulk Inquiry
          </h2>
          <p className="text-slate-500 font-normal text-sm mb-8">
            Complete the form and we will respond via WhatsApp with pricing and
            specifications.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field
                label="Business name"
                required
                value={businessName}
                onValueChange={setBusinessName}
                placeholder="Your business name"
              />
              <Field
                label="Contact name"
                required
                value={contactName}
                onValueChange={setContactName}
                placeholder="Your full name"
              />
            </div>

            <Field
              label="Phone number"
              type="tel"
              required
              value={phone}
              onValueChange={setPhone}
              placeholder="+234..."
            />

            <Field
              label="Product(s) interested in"
              required
              value={products}
              onValueChange={setProducts}
              placeholder="e.g. Red Palm Oil, Virgin Coconut Oil, Natural Extracts"
            />

            <Field
              label="Estimated quantity"
              required
              value={quantity}
              onValueChange={setQuantity}
              placeholder="e.g. 100kg"
            />

            <Field
              label="Additional message (optional)"
              type="textarea"
              rows={4}
              value={message}
              onValueChange={setMessage}
              placeholder="Any specific requirements, delivery location, timeline, etc."
            />

            <Button
              type="submit"
              disabled={!whatsappNumber}
              className="w-full"
            >
              {whatsappNumber
                ? "Request Bulk Quote on WhatsApp"
                : "WhatsApp not configured"}
            </Button>
          </form>
        </div>
      </section>

      {/* Wholesale & Custom Catalog Section */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-950 rounded-5xl p-8 sm:p-12 text-center relative overflow-hidden border border-slate-900">
            <div className="relative z-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-400 mb-3">
                Commercial & Wholesale
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3">
                Looking for our full catalog or custom specifications?
              </h3>
              <p className="text-slate-300 text-sm font-normal mb-8 max-w-lg mx-auto leading-relaxed">
                Whether you are stocking retail shelves, sourcing for a commercial kitchen, or formulating clean-label foods — we supply cold-pressed oils, unrefined flours, and natural extracts in tailored commercial volumes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => {
                    if (whatsappNumber) {
                      const text = "Hello GFO Foods! I would like to inquire about wholesale catalog pricing and custom bulk specifications.";
                      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
                      window.open(url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  disabled={!whatsappNumber}
                  variant="primary"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.584 1.777.818 2.796.818 3.181 0 5.767-2.586 5.767-5.768.001-3.182-2.585-5.768-5.767-5.768zm3.385 8.165c-.141.396-.714.733-1.018.775-.291.042-.647.065-2.023-.509-1.637-.681-2.684-2.348-2.766-2.457-.08-.109-.652-.868-.652-1.652 0-.784.41-1.17.556-1.328.147-.159.32-.198.427-.198.106 0 .213.002.307.006.1.005.234-.038.366.279.136.327.466 1.135.507 1.218.041.083.069.181.014.289-.055.109-.082.176-.164.272-.082.096-.172.215-.246.289-.082.082-.168.172-.072.336.095.165.424.7 1.002 1.215.744.663 1.371.868 1.564.965.193.096.307.083.42-.048.114-.131.488-.567.619-.76.13-.194.261-.161.439-.096.178.066 1.13.533 1.324.63.194.098.324.146.371.228.047.082.047.476-.094.872z" />
                  </svg>
                  Chat with Sales on WhatsApp
                </Button>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center h-12 px-5 rounded-lg text-sm font-semibold text-white/90 bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                >
                  Browse Retail Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
