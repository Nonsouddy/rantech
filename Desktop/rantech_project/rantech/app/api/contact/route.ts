import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSubmissions, saveSubmissions } from "@/lib/db";
import type { Submission } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const name = body?.name?.trim();
  const phone = body?.phone?.trim();
  const email = body?.email?.trim();
  const service = body?.service?.trim();
  const message = body?.message?.trim();

  if (!name || !phone || !email || !service || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const submission: Submission = {
    id: crypto.randomUUID(),
    name,
    phone,
    email,
    service,
    message,
    createdAt: new Date().toISOString(),
    confirmationSent: false,
    confirmationSentAt: null,
  };

  const submissions = getSubmissions();
  submissions.unshift(submission);
  saveSubmissions(submissions);

  return NextResponse.json({ ok: true });
}