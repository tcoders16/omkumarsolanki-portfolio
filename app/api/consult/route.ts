import { NextRequest, NextResponse } from "next/server";
import { addConsult, type ConsultLead } from "@/lib/consults-store";

// IP rate limit (mirrors business-chat).
const RATE_STORE = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 12;
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

type ConsultBody = {
  company?: string;
  industry?: string;
  whatTheyDo?: string;
  problem?: string;
  history?: { role: string; content: string }[];
  persist?: boolean; // first submission persists a lead; follow-up chat does not
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: "Rate limit reached. Reach Om directly at emailtosolankiom@gmail.com" },
      { status: 429 }
    );
  }

  const base = process.env.AGENT_SERVICE_URL;
  if (!base) {
    return NextResponse.json(
      { error: "Consulting agent is not configured (AGENT_SERVICE_URL missing)." },
      { status: 503 }
    );
  }

  let body: ConsultBody;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const problem = (body.problem || "").trim().slice(0, 1000);
  if (!problem) return NextResponse.json({ error: "Describe your problem first." }, { status: 400 });

  try {
    const res = await fetch(`${base}/consult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.AGENT_SERVICE_KEY ? { "x-service-key": process.env.AGENT_SERVICE_KEY } : {}),
      },
      body: JSON.stringify({
        company: (body.company || "").slice(0, 120),
        what_they_do: (body.whatTheyDo || "").slice(0, 600),
        industry: (body.industry || "").slice(0, 120),
        problem,
        history: (body.history ?? [])
          .slice(-8)
          .filter(m => ["user", "assistant"].includes(m.role) && typeof m.content === "string")
          .map(m => ({ role: m.role, content: m.content.slice(0, 2000) })),
      }),
      // The agent graph can take a few seconds.
      signal: AbortSignal.timeout(45_000),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.detail || "Agent error" }, { status: res.status });
    }

    // Persist a lead on the first submission so Om can see it in the dashboard.
    let leadId: string | undefined;
    if (body.persist !== false) {
      leadId = crypto.randomUUID();
      const lead: ConsultLead = {
        id: leadId,
        company: body.company || "",
        industry: body.industry || "",
        whatTheyDo: body.whatTheyDo || "",
        problem,
        intent: data.classification?.intent || "business_problem",
        domain: data.classification?.domain || "general",
        urgency: data.classification?.urgency || "medium",
        matched: !!data.matched_case?.matched,
        reference: data.matched_case?.reference,
        solution: data.matched_case?.solution,
        result: data.matched_case?.result,
        answer: data.answer || "",
        trace: (data.trace ?? []).map((t: { agent: string; label: string }) => ({
          agent: t.agent, label: t.label,
        })),
        createdAt: new Date().toISOString(),
      };
      try { await addConsult(lead); } catch (e) { console.error("[consult] persist failed:", e); }
    }

    return NextResponse.json({ ...data, leadId });
  } catch (e) {
    console.error("[consult] proxy error:", e);
    return NextResponse.json({ error: "Consulting agent unavailable. Try again shortly." }, { status: 502 });
  }
}
