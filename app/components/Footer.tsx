"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchSettings } from "@/app/lib/api-client";
import GfoWordmark from "./GfoWordmark";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchSettings().then((s) => setWhatsappNumber(s.whatsappNumber ?? ""));
  }, []);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white pt-32 pb-16 px-6 sm:px-12 border-t border-slate-900 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24 relative z-10 animate-in fade-in duration-1000">
        {/* Brand & Info */}
        <div className="space-y-10">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <GfoWordmark size="lg" dark={true} />
          </Link>
          <p className="text-slate-500 text-[14px] leading-relaxed max-w-xs font-normal border-l border-white/5 pl-6">
            Natural, clean-label Nigerian ingredients. Crafted with integrity,
            sourced with care. Delivering the finest African wellness to your
            doorstep.
          </p>
          <div className="flex gap-4">
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Direct WhatsApp Chat"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
            )}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069v-2.163c-3.205 0-3.584.013-4.849.07-3.66.167-5.679 2.185-5.845 5.845-.057 1.265-.07 1.645-.07 4.849 0-3.205.013-3.584.07 4.849.167 3.661 2.185 5.679 5.845 5.845 1.265.057 1.645.07 4.849.07 3.205 0 3.584-.013 4.849-.07 3.66-.167 5.679-2.185 5.845-5.845.057-1.265.07-1.645.07-4.849 0-3.205-.013-3.584-.07-4.849-.167-3.66-2.185-5.678-5.845-5.845-1.265-.057-1.645-.07-4.849-.07zm0 4.808c-2.744 0-4.97 2.225-4.97 4.97s2.225 4.97 4.97 4.97 4.97-2.225 4.97-4.97-2.225-4.97-4.97-4.97zm0 8.213c-1.791 0-3.242-1.452-3.242-3.243s1.451-3.242 3.242-3.242 3.242 1.451 3.242 3.242-1.451 3.243-3.242 3.243zm6.406-11.845c-.646 0-1.169.523-1.169 1.169s.523 1.169 1.169 1.169 1.169-.523 1.169-1.169-.523-1.169-1.169-1.169z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-emerald-400">
            Catalog
          </p>
          <ul className="space-y-5">
            {[
              "Ijebu Yellow Garri",
              "Unrefined Red Palm Oil",
              "African Spice Blend",
              "Virgin Coconut Oil",
              "Carrot Extract Oil",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="/products"
                  className="text-slate-500 hover:text-white text-[13px] font-semibold transition-all"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-6">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-emerald-400">
            Navigation
          </p>
          <ul className="space-y-5">
            {[
              "About Mervida",
              "Contact Desk",
              "Bulk Inquiries",
              "Diaspora Shopping",
              "Elder Care Shopping",
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
                      "/personal-shopping/diaspora",
                      "/personal-shopping/elder-care",
                      "/faq",
                      "/admin/login",
                    ][idx]
                  }
                  className="text-slate-500 hover:text-white text-[13px] font-semibold transition-all"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter/Contact placeholder */}
        <div className="space-y-6">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-emerald-400">
            Presence
          </p>
          <div className="space-y-6">
            <p className="text-slate-500 text-[14px] font-normal leading-relaxed">
              Lagos, Nigeria
              <br />
              <span className="text-white/40 text-[10px] font-extrabold tracking-widest uppercase">
                Distributed Worldwide
              </span>
            </p>
            <div className="pt-4">
              <p className="text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase mb-3">
                Direct Communication
              </p>
              <a
                href="mailto:info@gfofoods.com"
                className="text-white font-semibold text-sm hover:text-emerald-400 transition-colors border-b border-emerald-500/20 pb-0.5"
              >
                info@gfofoods.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <p className="text-slate-500 text-[10px] font-normal tracking-[0.3em] uppercase">
          &copy; {mounted ? currentYear : ""} GFO Foods Limited. All rights
          reserved.
        </p>
        <div className="flex flex-wrap gap-8 sm:gap-10 justify-center items-center">
          <Link
            href="/faq"
            className="text-slate-500 hover:text-white text-[9px] font-semibold uppercase tracking-widest transition-all"
          >
            Help & FAQ
          </Link>
          <Link
            href="/privacy"
            className="text-slate-500 hover:text-white text-[9px] font-semibold uppercase tracking-widest transition-all"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-slate-500 hover:text-white text-[9px] font-semibold uppercase tracking-widest transition-all"
          >
            Terms of Service
          </Link>
        </div>
      </div>

      {/* Background purely aesthetic branding element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-display font-extrabold text-white/5 pointer-events-none select-none tracking-tighter italic">
        GFO
      </div>
    </footer>
  );
}
