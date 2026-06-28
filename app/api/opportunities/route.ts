import { NextRequest, NextResponse } from "next/server";

// IP rate limit (mirrors /api/consult).
const RATE_STORE = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_STORE.get(ip);
  if (!entry || now > entry.reset) {
    RATE_STORE.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: "Rate limit reached. Reach Om directly at om@resso.ai" },
      { status: 429 }
    );
  }

  const base = process.env.AGENT_SERVICE_URL;
  if (!base) {
    return NextResponse.json(
      { error: "Opportunity agent is not configured (AGENT_SERVICE_URL missing)." },
      { status: 503 }
    );
  }

  let body: { business?: string; goal?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const business = (body.business || "").trim().slice(0, 800);
  if (!business) {
    return NextResponse.json({ error: "Describe your business first." }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/opportunities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.AGENT_SERVICE_KEY ? { "x-service-key": process.env.AGENT_SERVICE_KEY } : {}),
      },
      body: JSON.stringify({ business, goal: (body.goal || "").slice(0, 400) }),
      signal: AbortSignal.timeout(45_000),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.detail || "Agent error" }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("[opportunities] proxy error:", e);
    return NextResponse.json(
      { error: "Couldn't reach the opportunity agent. Email om@resso.ai." },
      { status: 502 }
    );
  }
}
