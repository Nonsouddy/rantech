import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { findAdminById } from "./db";

export const SESSION_COOKIE = "rantech_session";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Fail loudly in development so a missing .env.local is obvious.
  console.warn(
    "[auth] JWT_SECRET is not set. Add it to .env.local before logging in."
  );
}

export type SessionPayload = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin";
};

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET || "dev-fallback-secret", {
    expiresIn: "1h",
  });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET || "dev-fallback-secret") as SessionPayload;
  } catch {
    return null;
  }
}

/** Read + verify the session cookie from an incoming request (Route Handlers). */
export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  // The JWT signature being valid only proves it was issued by this
  // server — it says nothing about whether that admin still exists.
  // Re-check against the data store so a deleted admin's old cookie
  // stops working immediately, not just when the token expires.
  const stillExists = findAdminById(payload.id);
  if (!stillExists) return null;

  return payload;
}