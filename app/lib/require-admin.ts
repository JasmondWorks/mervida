import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionCookieValue } from "@/app/lib/admin-session";

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifySessionCookieValue(store.get(ADMIN_SESSION_COOKIE)?.value);
}
