"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { getCategories } from "@/app/lib/store";
import type { Category } from "@/app/lib/types";

const NAV_LINKS = [
  { label: "Shop", href: "/products" },
  { label: "Bulk Orders", href: "/bulk-orders" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCats, setShowCats] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCategories(getCategories());
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowCats(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowCats(false), 300);
  };

  // Identify pages that have a dark hero section where the navbar needs to be white initially
  const isDarkPath =
    pathname === "/" ||
    ["/bulk-orders", "/contact", "/faq", "/privacy", "/terms"].some((p) =>
      pathname.startsWith(p),
    );
  const isDarkTheme = isDarkPath && !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-100 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-md py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 flex items-center justify-between transition-colors duration-500">
        {/* Logo - Dynamic Brand Asset */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-32 h-10 transition-all duration-500 group-hover:scale-105">
            <Image
              src="/images/mervida-logo.png"
              alt="Mervida Logo"
              fill
              className={`object-contain transition-all duration-500 ${isDarkTheme ? "brightness-0 invert" : ""}`}
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation - Dynamic Style */}
        <nav
          className={`hidden md:flex items-center gap-1 p-1 rounded-full border transition-all duration-500 ${
            isDarkTheme
              ? "border-white/10 bg-white/5 backdrop-blur-md"
              : "border-slate-100 bg-slate-50"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={
                link.label === "Shop" ? handleMouseEnter : undefined
              }
              onMouseLeave={
                link.label === "Shop" ? handleMouseLeave : undefined
              }
            >
              <Link
                href={link.href}
                className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 flex items-center gap-2 ${
                  isActive(link.href)
                    ? isDarkTheme
                      ? "bg-white text-slate-950"
                      : "bg-white text-slate-950 shadow-sm border border-slate-100"
                    : isDarkTheme
                      ? "text-white/60 hover:text-white"
                      : "text-slate-500 hover:text-slate-950"
                }`}
              >
                {link.label}
                {link.label === "Shop" && (
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${showCats ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </Link>

              {/* Categories Dropdown */}
              {link.label === "Shop" && (
                <div
                  className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 transition-all duration-300 transform origin-top-left ${
                    showCats
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="p-3 mb-2 border-b border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                      Collections
                    </p>
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      className="block px-4 py-3 rounded-2xl text-[12px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-emerald-700 transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    className="block px-4 py-3 rounded-2xl text-[12px] font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all mt-2"
                  >
                    View All Products
                  </Link>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all group scale-90 ${
              isDarkTheme
                ? "bg-white/10 text-white hover:bg-emerald-500 border border-white/10"
                : "bg-slate-950 text-white hover:bg-emerald-600"
            }`}
            aria-label="Open cart"
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
              />
            </svg>
            {totalItems > 0 && (
              <span
                className={`absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 ${isDarkTheme ? "border-emerald-950" : "border-slate-950"}`}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile hamburger - dynamic styling */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 scale-90 ${
              isDarkTheme
                ? "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                : "bg-slate-100 text-slate-950 hover:bg-slate-200"
            }`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M12 11.25H20.25M6 15.75H20.25"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Massive rounded card - slightly refined scale */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-6 top-24 bg-white/95 backdrop-blur-3xl rounded-5xl p-10 border border-slate-100 shadow-2xl animate-in fade-in slide-in-from-top-6 duration-700 z-100">
          <nav className="flex flex-col gap-6">
            {[{ label: "Home", href: "/" }, ...NAV_LINKS].map((link, i) => (
              <div key={link.href} className="space-y-4">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl font-display font-bold tracking-tight transition-colors ${
                    isActive(link.href)
                      ? "text-emerald-700"
                      : "text-slate-900 hover:text-emerald-600"
                  }`}
                >
                  {link.label}
                </Link>
                {link.label === "Shop" && categories.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pl-2">
                    {categories.slice(0, 4).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="text-[12px] font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
