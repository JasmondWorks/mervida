"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/lib/store";
import Image from "next/image";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/personal-shopping", label: "Personal Shopping" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  function isActive(href: string, exact: boolean = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="bg-white border-r border-slate-100 w-64 min-h-screen flex flex-col shrink-0">
      {/* Brand header - Consistent Logo */}
      <div className="px-8 py-10 border-b border-slate-50">
        <Link href="/" className="flex flex-col group leading-none">
          <div className="relative w-28 h-8 mb-2">
            <Image
              src="/images/mervida-logo.png"
              alt="Mervida Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[9px] font-bold tracking-[0.3em] text-slate-400 mt-1 uppercase">
            ADMIN PORTAL
          </span>
        </Link>
      </div>

      {/* Nav links - Pill style consistent with Navbar */}
      <nav className="px-4 py-8 flex-1 space-y-2">
        {NAV.map(({ href, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all rounded-full ${
              isActive(href, exact)
                ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout - Red accent consistent with reset/clear buttons */}
      <div className="px-4 py-8 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
        >
          Disconnect Session
        </button>
      </div>
    </aside>
  );
}
