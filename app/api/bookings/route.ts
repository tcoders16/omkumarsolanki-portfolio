export const dynamic = "force-dynamic";
export const runtime  = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getBookings, addBooking, notifyEmail } from "@/lib/bookings-store";

// ── IP Rate Limiter ───────────────────────────────────────────────────────────
const RATE_LIMIT   = 5;
const WINDOW_MS    = 60 * 60 * 1000;

const g = globalThis as typeof globalThis & {
  __bookingRateMap?: Map<string, { count: number; resetAt: number }>;
};
if (!g.__bookingRateMap) g.__bookingRateMap = new Map();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now    = Date.now();
  const entry  = g.__bookingRateMap!.get(ip);
  if (!entry || now > entry.resetAt) {
    g.__bookingRateMap!.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true, retryAfterSec: 0 };
}

export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, retryAfterSec } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(retryAfterSec / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }

  let body: { date?: string; slot?: string; name?: string; email?: string; note?: string; };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { date, slot, name, email, note = "" } = body;

  if (!date || !slot || !name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name, email, date and slot are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const [h, m] = slot.split(":").map(Number);
  const [y, mo, d] = date.split("-").map(Number);
  const slotTime = new Date(Date.UTC(y, mo - 1, d, h + 5, m));
  if (slotTime <= new Date()) {
    return NextResponse.json({ error: "That slot is in the past." }, { status: 400 });
  }

  const bookings = await getBookings();

  const emailClash = bookings.find(b => b.email.toLowerCase() === email.trim().toLowerCase());
  if (emailClash) {
    return NextResponse.json(
      { error: "This email already has a booking. Reach Om at emailtosolankiom@gmail.com to reschedule." },
      { status: 409 }
    );
  }

  const dayClash = bookings.find(b => b.date === date);
  if (dayClash) {
    return NextResponse.json({ error: "That day is already taken — pick another." }, { status: 409 });
  }

  const slotClash = bookings.find(b => b.date === date && b.slot === slot);
  if (slotClash) {
    return NextResponse.json({ error: "That slot was just taken — pick another." }, { status: 409 });
  }

  const booking = {
    id:       randomUUID(),
    date, slot,
    name:     name.trim().slice(0, 60),
    email:    email.trim().slice(0, 120),
    note:     note.trim().slice(0, 300),
    bookedAt: new Date().toISOString(),
  };

  await addBooking(booking);
  notifyEmail(booking);

  return NextResponse.json({ success: true, booking });
}
