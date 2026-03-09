"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import { initStore, isAuthenticated } from "@/app/lib/store";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initStore();
    if (pathname !== "/admin/login" && !isAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 animate-pulse italic">
          initializing environment...
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-white min-w-0">{children}</main>
    </div>
  );
}
