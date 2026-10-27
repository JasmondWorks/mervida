"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import GfoWordmark from "@/app/components/GfoWordmark";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Access is enforced server-side in middleware.ts via the signed session
  // cookie, so this component only needs to pick the right chrome.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar — centered logo, trailing menu button */}
        <header className="md:hidden grid grid-cols-[1fr_auto_1fr] items-center px-5 py-4 border-b border-slate-100 bg-white sticky top-0 z-30">
          <div />
          <div className="justify-self-center">
            <GfoWordmark size="sm" />
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all justify-self-end"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-auto bg-white min-w-0">{children}</main>
      </div>
    </div>
  );
}
