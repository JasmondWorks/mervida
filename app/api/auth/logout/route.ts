import { ADMIN_SESSION_COOKIE } from "@/app/lib/admin-session";
import { apiSuccess } from "@/app/lib/api-response";

export async function POST() {
  const response = apiSuccess({ ok: true }, { message: "Logged out successfully." });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
