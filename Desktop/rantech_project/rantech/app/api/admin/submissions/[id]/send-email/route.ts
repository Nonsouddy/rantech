import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getSubmissions, saveSubmissions } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/mailer";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;

  const submissions = getSubmissions();
  const index = submissions.findIndex((s) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  try {
    await sendConfirmationEmail(submissions[index]);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send email." },
      { status: 500 }
    );
  }

  submissions[index] = {
    ...submissions[index],
    confirmationSent: true,
    confirmationSentAt: new Date().toISOString(),
  };
  saveSubmissions(submissions);

  return NextResponse.json({ submission: submissions[index] });
}