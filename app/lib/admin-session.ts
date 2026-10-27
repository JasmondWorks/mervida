import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "mervida_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function sign(value: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionCookieValue(): string {
  const payload = `admin.${Date.now() + MAX_AGE_SECONDS * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionCookieValue(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const lastDot = cookieValue.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = cookieValue.slice(0, lastDot);
  const signature = cookieValue.slice(lastDot + 1);

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const expiry = Number(payload.split(".")[1]);
  return Number.isFinite(expiry) && Date.now() < expiry;
}

export function verifyPin(pin: string): boolean {
  const expected = process.env.ADMIN_PIN;
  if (!expected) throw new Error("ADMIN_PIN is not set");
  if (pin.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(pin), Buffer.from(expected));
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE = MAX_AGE_SECONDS;
