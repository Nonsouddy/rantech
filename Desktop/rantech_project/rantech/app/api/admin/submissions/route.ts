import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getSubmissions } from "@/lib/db";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ submissions: getSubmissions() });
}