/**
 * Shared singleton store for live calendar bookings.
 * Uses globalThis so state survives Next.js hot-reloads in dev.
 * For Vercel serverless you'd swap file + Map with a KV store (e.g. Upstash Redis).
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export type Booking = {
  id: string;
  date: string;     // "YYYY-MM-DD"
  slot: string;     // "HH:MM" (24-hr ET)
  name: string;
  email: string;
  note: string;
  bookedAt: string; // ISO timestamp
};

const DATA_FILE = join(process.cwd(), "data", "bookings.json");

// ── Survive hot-reloads ──────────────────────────────────────────────────────
const g = globalThis as typeof globalThis & {
  __bookings?:    Booking[];
  __sseSubs?:     Set<ReadableStreamDefaultController<Uint8Array>>;
};

if (!g.__bookings) {
  try {
    g.__bookings = existsSync(DATA_FILE)
      ? JSON.parse(readFileSync(DATA_FILE, "utf-8"))
      : [];
  } catch { g.__bookings = []; }
}
if (!g.__sseSubs) g.__sseSubs = new Set();

export const sseSubs = g.__sseSubs!;

// ── Accessors ────────────────────────────────────────────────────────────────
export function getBookings(): Booking[] {
  return g.__bookings!;
}

export function addBooking(b: Booking): void {
  g.__bookings!.push(b);
  try { writeFileSync(DATA_FILE, JSON.stringify(g.__bookings, null, 2)); } catch {}
  broadcast({ type: "booking", bookings: g.__bookings });
  broadcastWatchers();
}

// ── SSE helpers ──────────────────────────────────────────────────────────────
const enc = new TextEncoder();

export function broadcast(data: object): void {
  const chunk = enc.encode(`data: ${JSON.stringify(data)}\n\n`);
  for (const ctrl of sseSubs) {
    try   { ctrl.enqueue(chunk); }
    catch { sseSubs.delete(ctrl); }
  }
}

export function broadcastWatchers(): void {
  broadcast({ type: "watchers", count: sseSubs.size });
}

// ── Email via Gmail SMTP (nodemailer) ─────────────────────────────────────────
import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST   ?? "smtp.gmail.com",
    port:   Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function notifyEmail(b: Booking): Promise<void> {
  if (!process.env.SMTP_PASS || process.env.SMTP_PASS === "your_gmail_app_password_here") {
    console.log(`[booking] SMTP not configured — skipping email for ${b.name}`);
    return;
  }
  try {
    await getTransporter().sendMail({
      from:    `"Portfolio Bookings" <${process.env.SMTP_USER}>`,
      to:      process.env.NOTIFY_EMAIL ?? process.env.SMTP_USER,
      subject: `New booking: ${b.name} — ${b.date} at ${b.slot} ET`,
      html: `
        <div style="font-family:monospace;max-width:560px;padding:28px;background:#0a0a0a;color:#ededed;border-radius:6px;">
          <h2 style="color:#3dba7e;font-size:0.9rem;margin:0 0 20px;letter-spacing:0.1em;text-transform:uppercase;">
            New 30-min Strategy Call
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="color:#555;padding:5px 0;width:60px;font-size:0.7rem;">NAME</td><td style="color:#ededed;padding:5px 0;">${b.name}</td></tr>
            <tr><td style="color:#555;padding:5px 0;font-size:0.7rem;">EMAIL</td><td style="padding:5px 0;"><a href="mailto:${b.email}" style="color:#4a9eff;">${b.email}</a></td></tr>
            <tr><td style="color:#555;padding:5px 0;font-size:0.7rem;">DATE</td><td style="color:#ededed;padding:5px 0;">${b.date}</td></tr>
            <tr><td style="color:#555;padding:5px 0;font-size:0.7rem;">TIME</td><td style="color:#ededed;padding:5px 0;">${b.slot} ET · 30 min</td></tr>
            ${b.note ? `<tr><td style="color:#555;padding:5px 0;font-size:0.7rem;vertical-align:top;">NOTE</td><td style="color:#c8c4bc;padding:5px 0;">${b.note}</td></tr>` : ""}
          </table>
          <p style="color:#444;font-size:0.7rem;margin:0;">Reply to this email to confirm or reschedule.</p>
        </div>
      `,
      replyTo: b.email,
    });
    console.log(`[booking] email sent for ${b.name} (${b.date} ${b.slot})`);
  } catch (e) {
    console.error("[booking] email failed:", e);
  }
}
