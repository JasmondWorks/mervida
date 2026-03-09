"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white pt-32 pb-16 px-6 sm:px-12 border-t border-slate-900 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24 relative z-10 animate-in fade-in duration-1000">
        {/* Brand & Info */}
        <div className="space-y-10">
          <Link href="/" className="flex items-center group w-fit">
            <div className="relative w-32 h-10 transition-all duration-500 group-hover:scale-105">
              <Image
                src="/images/mervida-logo.png"
                alt="Mervida Logo"
                fill
                className="object-contain brightness-0 invert transition-all duration-500"
              />
            </div>
          </Link>
          <p className="text-slate-500 text-[14px] leading-relaxed max-w-xs font-medium border-l border-white/5 pl-6">
            Natural, clean-label Nigerian ingredients. Crafted with integrity,
            sourced with care. Delivering the finest African wellness to your
            doorstep.
          </p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069v-2.163c-3.205 0-3.584.013-4.849.07-3.66.167-5.679 2.185-5.845 5.845-.057 1.265-.07 1.645-.07 4.849 0-3.205.013-3.584.07 4.849.167 3.661 2.185 5.679 5.845 5.845 1.265.057 1.645.07 4.849.07 3.205 0 3.584-.013 4.849-.07 3.66-.167 5.679-2.185 5.845-5.845.057-1.265.07-1.645.07-4.849 0-3.205-.013-3.584-.07-4.849-.167-3.66-2.185-5.678-5.845-5.845-1.265-.057-1.645-.07-4.849-.07zm0 4.808c-2.744 0-4.97 2.225-4.97 4.97s2.225 4.97 4.97 4.97 4.97-2.225 4.97-4.97-2.225-4.97-4.97-4.97zm0 8.213c-1.791 0-3.242-1.452-3.242-3.243s1.451-3.242 3.242-3.242 3.242 1.451 3.242 3.242-1.451 3.243-3.242 3.243zm6.406-11.845c-.646 0-1.169.523-1.169 1.169s.523 1.169 1.169 1.169 1.169-.523 1.169-1.169-.523-1.169-1.169-1.169z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-10">
          <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-emerald-500/50">
            Catalog
          </h3>
          <ul className="space-y-5">
            {[
              "Plantain Flour",
              "Date Powder",
              "Date Syrup",
              "Natural Sea Salt",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="/products"
                  className="text-slate-500 hover:text-white text-[13px] font-bold transition-all"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-10">
          <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-emerald-500/50">
            Navigation
          </h3>
          <ul className="space-y-5">
            {[
              "About Mervida",
              "Contact Desk",
              "Bulk Inquiries",
              "Help & FAQ",
              "Portal Access",
            ].map((item, idx) => (
              <li key={item}>
                <Link
                  href={
                    [
                      "/about",
                      "/contact",
                      "/bulk-orders",
                      "/faq",
                      "/admin/login",
                    ][idx]
                  }
                  className="text-slate-500 hover:text-white text-[13px] font-bold transition-all"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter/Contact placeholder */}
        <div className="space-y-10">
          <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-emerald-500/50">
            Presence
          </h3>
          <div className="space-y-6">
            <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
              Lagos, Nigeria
              <br />
              <span className="text-white/40 text-[10px] font-black tracking-widest uppercase">
                Distributed Worldwide
              </span>
            </p>
            <div className="pt-4">
              <p className="text-[10px] font-black tracking-[0.3em] text-slate-800 uppercase mb-3">
                Direct Communication
              </p>
              <a
                href="mailto:info@gfofoods.com"
                className="text-white font-black text-sm hover:text-emerald-400 transition-colors border-b border-emerald-500/20 pb-0.5"
              >
                info@gfofoods.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <p className="text-slate-700 text-[10px] font-bold tracking-[0.3em] uppercase">
          &copy; {currentYear} GFO Foods Limited. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-8 sm:gap-10 justify-center">
          <Link
            href="/faq"
            className="text-slate-500 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-all"
          >
            Help & FAQ
          </Link>
          <Link
            href="/privacy"
            className="text-slate-500 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-all"
          >
            Security & Privacy
          </Link>
          <Link
            href="/terms"
            className="text-slate-500 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-all"
          >
            Usage Clauses
          </Link>
        </div>
      </div>

      {/* Background purely aesthetic branding element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-display font-black text-white/5 pointer-events-none select-none tracking-tighter italic">
        GFO
      </div>
    </footer>
  );
}
