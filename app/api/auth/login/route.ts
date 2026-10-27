import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionCookieValue,
  verifyPin,
} from "@/app/lib/admin-session";
import { apiSuccess, apiError } from "@/app/lib/api-response";

export async function POST(request: Request) {
  const { pin } = await request.json();

  if (typeof pin !== "string" || !verifyPin(pin)) {
    return apiError("Incorrect PIN.", 401);
  }

  const response = apiSuccess({ ok: true }, { message: "Authenticated successfully." });
  response.cookies.set(ADMIN_SESSION_COOKIE, createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return response;
}
