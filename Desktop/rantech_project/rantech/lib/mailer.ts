import nodemailer from "nodemailer";
import type { Submission } from "./types";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in .env.local"
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendConfirmationEmail(submission: Submission) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"RANTECH ELECTRICAL POWER COMPANY LIMITED" <${from}>`,
    to: submission.email,
    subject: "We've received your request — RANTECH Electrical Power",
    text:
      `Hi ${submission.name},\n\n` +
      `Thanks for reaching out to RANTECH ELECTRICAL POWER COMPANY LIMITED regarding ${submission.service}.\n` +
      `We've received your request and an engineer will get back to you within one business day.\n\n` +
      `Your message:\n"${submission.message}"\n\n` +
      `If this is urgent, call our 24/7 emergency line.\n\n` +
      `— RANTECH ELECTRICAL POWER COMPANY LIMITED`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#0B1220;">
        <div style="background:#0B1220;padding:24px;text-align:center;">
          <span style="color:#D98E33;font-size:20px;font-weight:700;letter-spacing:0.5px;">RANTECH</span>
        </div>
        <div style="padding:28px 24px;background:#F4F5F1;">
          <p>Hi ${submission.name},</p>
          <p>Thanks for reaching out to <strong>RANTECH ELECTRICAL POWER COMPANY LIMITED</strong> regarding <strong>${submission.service}</strong>.</p>
          <p>We've received your request and an engineer will get back to you within one business day.</p>
          <blockquote style="border-left:3px solid #D98E33;margin:16px 0;padding:8px 16px;color:#444;background:#fff;">
            ${submission.message}
          </blockquote>
          <p>If this is urgent, please call our 24/7 emergency line.</p>
          <p style="margin-top:24px;color:#6B7480;font-size:12px;">— RANTECH ELECTRICAL POWER COMPANY LIMITED</p>
        </div>
      </div>
    `,
  });
}