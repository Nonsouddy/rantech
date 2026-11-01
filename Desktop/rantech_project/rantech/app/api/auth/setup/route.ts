import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getAdmins, saveAdmins, hasSuperAdmin, findAdminByEmail } from "@/lib/db";
import { signSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // This route only ever works once. The instant a super admin exists,
  // it refuses every future request — permanently.
  if (hasSuperAdmin()) {
    return NextResponse.json(
      { error: "Setup has already been completed. Please log in instead." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!name || !email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Name, email and an 8+ character password are required." },
      { status: 400 }
    );
  }

  if (findAdminByEmail(email)) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    role: "super_admin" as const,
    createdAt: new Date().toISOString(),
  };

  const admins = getAdmins();
  admins.push(admin);
  saveAdmins(admins);

  // Log the new super admin straight in, same as a normal login would.
  const token = signSession({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}