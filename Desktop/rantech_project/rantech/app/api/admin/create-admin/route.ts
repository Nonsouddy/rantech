import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getSessionFromCookies } from "@/lib/auth";
import { getAdmins, saveAdmins, findAdminByEmail } from "@/lib/db";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const admins = getAdmins().map(({ passwordHash: _passwordHash, ...rest }) => rest);
  return NextResponse.json({ admins });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json(
      { error: "Only the super admin can create new admins." },
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
      { error: "An admin with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admins = getAdmins();

  admins.push({
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
  });

  saveAdmins(admins);

  return NextResponse.json({ ok: true }, { status: 201 });
}