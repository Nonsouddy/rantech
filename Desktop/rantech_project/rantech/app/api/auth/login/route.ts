import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findAdminByEmail } from "@/lib/db";
import { signSession, SESSION_COOKIE } from "@/lib/auth";

// Extremely simple in-memory rate limit (per server process).
// Good enough to slow down brute force on a single small server.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 8;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const admin = findAdminByEmail(email);
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = signSession({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  const res = NextResponse.json({
    ok: true,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}