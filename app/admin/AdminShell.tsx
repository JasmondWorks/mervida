"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Access is enforced server-side in middleware.ts via the signed session
  // cookie, so this component only needs to pick the right chrome.
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
