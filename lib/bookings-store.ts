/**
 * Bookings store backed by Upstash Redis.
 * Falls back to in-memory (dev) when env vars are not set.
 */
import { Redis } from "@upstash/redis";
import nodemailer from "nodemailer";

export type Booking = {
  id: string;
  date: string;     // "YYYY-MM-DD"
  slot: string;     // "HH:MM" (24-hr ET)
  name: string;
  email: string;
  note: string;
  bookedAt: string; // ISO timestamp
};

const REDIS_KEY = "portfolio:bookings";

// ── Redis client (lazy singleton) ─────────────────────────────────────────────
function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) return null;
  return new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// ── In-memory fallback (dev) ───────────────────────────────────────────────────
const g = globalThis as typeof globalThis & {
  __bookings?:  Booking[];
  __sseSubs?:   Set<ReadableStreamDefaultController<Uint8Array>>;
};
if (!g.__bookings)  g.__bookings  = [];
if (!g.__sseSubs)   g.__sseSubs   = new Set();

export const sseSubs = g.__sseSubs!;

// ── Accessors ─────────────────────────────────────────────────────────────────
export async function getBookings(): Promise<Booking[]> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get<Booking[]>(REDIS_KEY);
    return raw ?? [];
  }
  return g.__bookings!;
}

export async function addBooking(b: Booking): Promise<void> {
  const redis = getRedis();
  if (redis) {
    const current = await getBookings();
    current.push(b);
    await redis.set(REDIS_KEY, current);
    broadcast({ type: "booking", bookings: current });
  } else {
    g.__bookings!.push(b);
    broadcast({ type: "booking", bookings: g.__bookings });
  }
  broadcastWatchers();
}

// ── SSE helpers ───────────────────────────────────────────────────────────────
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

// ── Email via Gmail SMTP ──────────────────────────────────────────────────────
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

  const transporter = getTransporter();
  const from = `"Om Kumar Solanki" <${process.env.SMTP_USER}>`;

  // 1. Notify Om
  try {
    await transporter.sendMail({
      from,
      to:      process.env.NOTIFY_EMAIL ?? process.env.SMTP_USER,
      subject: `📅 New booking: ${b.name} — ${b.date} at ${b.slot} ET`,
      replyTo: b.email,
      html: `
        <div style="font-family:monospace;max-width:560px;padding:28px;background:#0a0a0a;color:#ededed;border-radius:6px;">
          <h2 style="color:#3dba7e;font-size:0.9rem;margin:0 0 20px;letter-spacing:0.1em;text-transform:uppercase;">
            New 30-min Strategy Call Booked
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="color:#555;padding:5px 0;width:60px;font-size:0.7rem;">NAME</td><td style="color:#ededed;padding:5px 0;">${b.name}</td></tr>
            <tr><td style="color:#555;padding:5px 0;font-size:0.7rem;">EMAIL</td><td style="padding:5px 0;"><a href="mailto:${b.email}" style="color:#4a9eff;">${b.email}</a></td></tr>
            <tr><td style="color:#555;padding:5px 0;font-size:0.7rem;">DATE</td><td style="color:#ededed;padding:5px 0;">${b.date}</td></tr>
            <tr><td style="color:#555;padding:5px 0;font-size:0.7rem;">TIME</td><td style="color:#ededed;padding:5px 0;">${b.slot} ET · 30 min</td></tr>
            ${b.note ? `<tr><td style="color:#555;padding:5px 0;font-size:0.7rem;vertical-align:top;">NOTE</td><td style="color:#c8c4bc;padding:5px 0;">${b.note}</td></tr>` : ""}
          </table>
          <p style="color:#444;font-size:0.7rem;margin:0;">Hit reply to reach ${b.name} directly.</p>
        </div>
      `,
    });
    console.log(`[booking] notified Om for ${b.name} (${b.date} ${b.slot})`);
  } catch (e) {
    console.error("[booking] Om notify failed:", e);
  }

  // 2. Confirm to booker
  try {
    await transporter.sendMail({
      from,
      to:      b.email,
      subject: `Your call with Om is confirmed — ${b.date} at ${b.slot} ET`,
      replyTo: process.env.NOTIFY_EMAIL ?? process.env.SMTP_USER,
      html: `
        <div style="font-family:monospace;max-width:560px;padding:28px;background:#0a0a0a;color:#ededed;border-radius:6px;">
          <h2 style="color:#3dba7e;font-size:0.9rem;margin:0 0 8px;letter-spacing:0.1em;text-transform:uppercase;">
            You're booked ✓
          </h2>
          <p style="color:#888;font-size:0.75rem;margin:0 0 24px;">Hi ${b.name}, your 30-min strategy call with Om Kumar Solanki is confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="color:#555;padding:5px 0;width:60px;font-size:0.7rem;">DATE</td><td style="color:#ededed;padding:5px 0;">${b.date}</td></tr>
            <tr><td style="color:#555;padding:5px 0;font-size:0.7rem;">TIME</td><td style="color:#ededed;padding:5px 0;">${b.slot} ET · 30 min</td></tr>
            <tr><td style="color:#555;padding:5px 0;font-size:0.7rem;">WITH</td><td style="color:#ededed;padding:5px 0;">Om Kumar Solanki — AI/ML Engineer</td></tr>
          </table>
          <p style="color:#555;font-size:0.7rem;margin:0 0 8px;">Om will reach out with a meeting link shortly. Reply to this email if you need to reschedule.</p>
          <p style="color:#333;font-size:0.65rem;margin:0;">omkumarsolanki.com</p>
        </div>
      `,
    });
    console.log(`[booking] confirmation sent to ${b.email}`);
  } catch (e) {
    console.error("[booking] booker confirm failed:", e);
  }
}
