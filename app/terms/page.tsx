export default function TermsPage() {
  return (
    <main className="bg-[#faf9f7] min-h-screen">
      {/* Header */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500 mb-5">
            Legal Documentation
          </p>
          <h1 className="text-5xl font-display font-bold tracking-tighter">
            Terms of Service
          </h1>
          <p className="text-slate-400 mt-6 text-[10px] font-bold uppercase tracking-widest leading-none">
            Last modified: January 2025
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white rounded-5xl p-10 md:p-16 shadow-2xl shadow-slate-950/5 border border-slate-100/50 space-y-12">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By using the Mervida website operated by GFO Foods Limited, you
              agree to these terms of service. If you do not agree, please do
              not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              2. Order Confirmation
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All orders are placed via WhatsApp. An order is only confirmed
              once you receive a confirmation message from our team on WhatsApp.
              Adding items to your cart does not constitute a confirmed order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Payment</h2>
            <p className="text-gray-600 leading-relaxed">
              Payment is required before delivery unless otherwise agreed. We
              accept bank transfer, POS payment, and cash on delivery for select
              locations. Payment details are provided after order confirmation
              via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Prices</h2>
            <p className="text-gray-600 leading-relaxed">
              All prices are listed in Nigerian Naira (&#8358;). Prices are
              subject to change without notice. The price at the time of order
              confirmation is the final price.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              5. Returns and Refunds
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We accept returns within 7 days of delivery for goods that are
              damaged, defective, or not as described. Items must be returned in
              their original condition. Contact us via WhatsApp to initiate a
              return. Refunds are processed via bank transfer within 5 business
              days of us receiving the returned item.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              6. Delivery
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We deliver across Nigeria. Delivery times and fees vary by
              location and will be confirmed at the time of order. GFO Foods
              Limited is not responsible for delays caused by circumstances
              beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              7. Product Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We make every effort to ensure product descriptions and images are
              accurate. However, slight variations in colour or appearance from
              images may occur. If you have any questions about a product,
              contact us before purchasing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For any queries regarding these terms, please contact GFO Foods
              Limited via WhatsApp or through our contact page. We are based in
              Lagos, Nigeria.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
