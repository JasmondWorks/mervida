export default function PrivacyPage() {
  return (
    <main className="bg-[#faf9f7] min-h-screen">
      {/* Header */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500 mb-5">
            Legal Documentation
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 mt-4 text-[10px] font-bold uppercase tracking-widest leading-none">
            Last modified: January 2025
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-5xl p-8 sm:p-12 md:p-16 shadow-2xl shadow-slate-950/5 border border-slate-100/50 space-y-10">
          <section>
            <h2 className="text-lg font-bold text-slate-950 mb-2 tracking-tight">Overview</h2>
            <p className="text-slate-600 text-[15px] leading-relaxed font-normal">
              GFO Foods Limited (operating the Mervida brand) takes your privacy
              seriously. This policy explains how we handle your data when you
              use our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-950 mb-2 tracking-tight">
              Data We Collect
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed font-normal mb-3">
              Our website stores data only in your browser&apos;s{" "}
              <strong>localStorage</strong>. This means:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm font-normal">
              <li>
                Your cart contents are saved on your device only, not on any
                server.
              </li>
              <li>No account is required to browse or shop.</li>
              <li>
                No personal data is transmitted to or stored on our servers from
                this website.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-950 mb-2 tracking-tight">
              Cookies and Tracking
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed font-normal">
              We do not use cookies. We do not track your browsing behaviour. We
              do not use analytics services. Your visit to this site is entirely
              private.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-950 mb-2 tracking-tight">
              WhatsApp Communication
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed font-normal">
              When you click &quot;Order via WhatsApp&quot; or submit a contact
              form, you are redirected to WhatsApp with a pre-filled message. By
              sending this message, you are initiating contact with us via
              WhatsApp and consenting to communication through that platform.
              WhatsApp&apos;s own privacy policy applies to messages sent
              through their service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-950 mb-2 tracking-tight">
              Data Retention
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed font-normal">
              Because all data is stored locally on your device, you can clear
              it at any time by clearing your browser&apos;s localStorage or
              browsing data. We do not retain any customer data on external
              servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-950 mb-2 tracking-tight">Contact</h2>
            <p className="text-slate-600 text-[15px] leading-relaxed font-normal">
              If you have any questions about this privacy policy, please
              contact us via WhatsApp or through our contact page. GFO Foods
              Limited is based in Lagos, Nigeria.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
