import { NextRequest, NextResponse } from "next/server";
import { addEvent, type AnalyticsEvent } from "@/lib/analytics-store";

// Public ingest endpoint — the client tracker POSTs visitor events here.
// Intentionally tolerant: bad payloads are dropped, never error the visitor.
export const runtime = "nodejs";

const TYPES = new Set(["pageview", "click", "section", "heartbeat"]);

function refHost(referrer: string | null): string | undefined {
  if (!referrer) return undefined;
  try {
    const h = new URL(referrer).hostname.replace(/^www\./, "");
    // Ignore self-referrals (internal navigation).
    return h || undefined;
  } catch {
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const type = String(body.type ?? "");
  const sid  = String(body.sid ?? "").slice(0, 64);
  const path = String(body.path ?? "/").slice(0, 256);
  if (!TYPES.has(type) || !sid) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Referrer: prefer client-supplied (first external referrer), fall back to header.
  const selfHost = req.headers.get("host")?.replace(/^www\./, "");
  let ref = typeof body.ref === "string" ? body.ref.slice(0, 120) : undefined;
  if (!ref) ref = refHost(req.headers.get("referer"));
  if (ref && ref === selfHost) ref = undefined;

  const ev: AnalyticsEvent = {
    id: `${Date.now().toString(36)}-${Math.round(performance.now() % 1e6).toString(36)}`,
    sid,
    type: type as AnalyticsEvent["type"],
    path,
    label:  typeof body.label === "string" ? body.label.slice(0, 120) : undefined,
    ref,
    device: ["mobile", "tablet", "desktop"].includes(String(body.device))
      ? (body.device as AnalyticsEvent["device"])
      : undefined,
    ts: Date.now(),
  };

  try {
    await addEvent(ev);
  } catch (e) {
    console.error("[track] failed to store event:", e);
  }
  return NextResponse.json({ ok: true });
}
