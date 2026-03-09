"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { getCategories } from "@/app/lib/store";
import type { Category } from "@/app/lib/types";

const PERSONAL_SHOPPING_LINKS = [
  { label: "Shop for the Diaspora", href: "/personal-shopping/diaspora" },
  { label: "Elder Care Shopping", href: "/personal-shopping/elder-care" },
];

const NAV_LINKS = [
  { label: "Shop", href: "/products" },
  { label: "Personal Shopping", href: "/personal-shopping" },
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
  const [showPS, setShowPS] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const psTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

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

  const handlePSMouseEnter = () => {
    if (psTimeoutRef.current) clearTimeout(psTimeoutRef.current);
    setShowPS(true);
  };

  const handlePSMouseLeave = () => {
    psTimeoutRef.current = setTimeout(() => setShowPS(false), 300);
  };

  // Identify pages that have a dark hero section where the navbar needs to be white initially
  const isDarkPath =
    pathname === "/" ||
    [
      "/bulk-orders",
      "/contact",
      "/faq",
      "/privacy",
      "/terms",
      "/personal-shopping",
    ].some((p) => pathname.startsWith(p));
  const isDarkTheme = isDarkPath && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-100 transition-all duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-md py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 flex items-center justify-between transition-colors duration-500">
          {/* Logo - Dynamic Brand Asset */}
          <Link href="/" className="flex items-center group shrink-0">
            <Image
              src="/images/mervida-logo.png"
              alt="Mervida Logo"
              width={128}
              height={40}
              className={`h-10 w-auto object-contain transition-all duration-500 group-hover:scale-105 ${isDarkTheme ? "brightness-0 invert" : ""}`}
              priority
            />
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
                  link.label === "Shop"
                    ? handleMouseEnter
                    : link.label === "Personal Shopping"
                      ? handlePSMouseEnter
                      : undefined
                }
                onMouseLeave={
                  link.label === "Shop"
                    ? handleMouseLeave
                    : link.label === "Personal Shopping"
                      ? handlePSMouseLeave
                      : undefined
                }
              >
                <Link
                  href={link.href}
                  className={`px-6 py-2 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all duration-500 flex items-center gap-2 ${
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
                  {(link.label === "Shop" ||
                    link.label === "Personal Shopping") && (
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${(link.label === "Shop" && showCats) || (link.label === "Personal Shopping" && showPS) ? "rotate-180" : ""}`}
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
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2">
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
                      className="block px-4 py-3 rounded-2xl text-[12px] font-semibold text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all mt-2"
                    >
                      View All Products
                    </Link>
                  </div>
                )}

                {/* Personal Shopping Dropdown */}
                {link.label === "Personal Shopping" && (
                  <div
                    className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 transition-all duration-300 transform origin-top-left ${
                      showPS
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="p-3 mb-2 border-b border-slate-50">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2">
                        Services
                      </p>
                    </div>
                    {PERSONAL_SHOPPING_LINKS.map((ps) => (
                      <Link
                        key={ps.href}
                        href={ps.href}
                        className="block px-4 py-3 rounded-2xl text-[12px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-emerald-700 transition-all"
                      >
                        {ps.label}
                      </Link>
                    ))}
                    <Link
                      href="/personal-shopping"
                      className="block px-4 py-3 rounded-2xl text-[12px] font-semibold text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all mt-2"
                    >
                      View All Services
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
      </header>

      {/* Mobile Sidebar - Slide out from right - Only render on client to avoid hydration issues */}
      {mounted && (
        <div
          className={`md:hidden fixed inset-0 z-110 transition-all duration-500 ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-500"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sidebar Content */}
          <div
            className={`absolute inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out transform p-8 flex flex-col ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header in sidebar */}
            <div className="flex items-center justify-between mb-10">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <Image
                  src="/images/mervida-logo.png"
                  alt="Mervida Logo"
                  width={100}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-950 active:scale-90 transition-transform"
              >
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
              </button>
            </div>

            <nav className="flex flex-col gap-1 overflow-y-auto pb-8">
              {[{ label: "Home", href: "/" }, ...NAV_LINKS].map((link) => (
                <div key={link.href} className="group">
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between py-4 border-b border-slate-50 text-xl font-bold tracking-tight transition-colors ${
                      isActive(link.href)
                        ? "text-emerald-700"
                        : "text-slate-900 hover:text-emerald-600"
                    }`}
                  >
                    {link.label}
                    <svg
                      className={`w-5 h-5 opacity-30 group-hover:opacity-100 transition-all ${isActive(link.href) ? "opacity-100 text-emerald-700" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Link>

                  {link.label === "Shop" && categories.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 py-3 pl-4 border-l-2 border-emerald-50 my-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.id}`}
                          onClick={() => setMenuOpen(false)}
                          className="py-2 text-[14px] font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {link.label === "Personal Shopping" && (
                    <div className="grid grid-cols-1 gap-2 py-3 pl-4 border-l-2 border-emerald-50 my-2">
                      {PERSONAL_SHOPPING_LINKS.map((ps) => (
                        <Link
                          key={ps.href}
                          href={ps.href}
                          onClick={() => setMenuOpen(false)}
                          className="py-2 text-[14px] font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                          {ps.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-slate-100">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 text-slate-900 font-bold"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
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
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm">Need Help?</p>
                  <p className="text-[10px] opacity-70">Contact our support</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
