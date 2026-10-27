"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const ICONS = {
  dashboard: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75",
  products: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25M21 7.5v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75V21",
  categories:
    "M3.75 7.5a2.25 2.25 0 012.25-2.25h3.879a1.5 1.5 0 011.06.44l1.122 1.12a1.5 1.5 0 001.061.44H18a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V7.5z",
  blog: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  orders:
    "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.705 2.602-7.189.114-.47-.251-.961-.735-.961H5.106M7.5 14.25L5.106 5.272M7.5 14.25l-1.323 2.145c-.35.567.055 1.302.72 1.302h11.925a2.25 2.25 0 100-4.5H7.5z",
  "personal-shopping":
    "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M15 15.75a4.5 4.5 0 10-5.733-6.933M8.625 15.75a4.5 4.5 0 100-9 4.5 4.5 0 000 9z",
  settings:
    "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.242.436-.613.428-.992a7.665 7.665 0 010-.255c.008-.378-.136-.75-.428-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z",
  logout: "M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25h-6a2.25 2.25 0 01-2.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
} as const;

function NavIcon({ path }: { path: string }) {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true, icon: ICONS.dashboard },
  { href: "/admin/products", label: "Products", icon: ICONS.products },
  { href: "/admin/categories", label: "Categories", icon: ICONS.categories },
  { href: "/admin/blog", label: "Blog", icon: ICONS.blog },
  { href: "/admin/orders", label: "Orders", icon: ICONS.orders },
  {
    href: "/admin/personal-shopping",
    label: "Personal Shopping",
    icon: ICONS["personal-shopping"],
  },
  { href: "/admin/settings", label: "Settings", icon: ICONS.settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function isActive(href: string, exact: boolean = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="bg-white border-r border-slate-100 w-64 min-h-screen flex flex-col shrink-0">
      {/* Brand header */}
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
          <span className="text-caption text-slate-400 mt-1" style={{ fontSize: "9px" }}>
            Admin
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="px-4 py-8 flex-1 space-y-1">
        {NAV.map(({ href, label, exact, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-6 py-3 text-[12px] font-semibold tracking-tight transition-all rounded-lg ${
              isActive(href, exact)
                ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <NavIcon path={icon} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-8 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-6 py-3 text-[12px] font-semibold tracking-tight text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <NavIcon path={ICONS.logout} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
