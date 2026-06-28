export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isConnected, isSlotBusy, createBooking } from "@/lib/google-calendar";

// Lightweight IP rate limit.
const g = globalThis as typeof globalThis & { __gcalRate?: Map<string, { c: number; r: number }> };
if (!g.__gcalRate) g.__gcalRate = new Map();
function rateOk(ip: string): boolean {
  const now = Date.now(); const e = g.__gcalRate!.get(ip);
  if (!e || now > e.r) { g.__gcalRate!.set(ip, { c: 1, r: now + 3_600_000 }); return true; }
  if (e.c >= 6) return false; e.c++; return true;
}

/** GET → whether Google Calendar is connected (so the UI can render). */
export async function GET() {
  return NextResponse.json({ connected: isConnected() });
}

/** POST {date, slot, name, email, note} → create the event on Om's calendar. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateOk(ip)) return NextResponse.json({ error: "Too many attempts — try again later." }, { status: 429 });

  if (!isConnected()) {
    return NextResponse.json({ error: "Google Calendar isn't connected yet." }, { status: 503 });
  }

  let body: { date?: string; slot?: string; name?: string; email?: string; note?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { date, slot, name, email, note = "" } = body;

  if (!date || !slot || !name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name, email, date and slot are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    if (await isSlotBusy(date, slot)) {
      return NextResponse.json({ error: "That time was just taken — pick another." }, { status: 409 });
    }
    const ev = await createBooking({ date, slot, name: name.trim().slice(0, 80), email: email.trim(), note: note.trim().slice(0, 500) });
    return NextResponse.json({ success: true, eventLink: ev.link ?? "" });
  } catch (e) {
    console.error("[gcal-book] create failed:", e);
    return NextResponse.json({ error: "Couldn't create the calendar event. Try again or email Om." }, { status: 502 });
  }
}
