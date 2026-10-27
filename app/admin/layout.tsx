import type { Metadata } from "next";
import AdminShell from './AdminShell';

export const metadata: Metadata = {
  title: "GFO Foods Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
