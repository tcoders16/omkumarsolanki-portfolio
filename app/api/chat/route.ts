import { NextRequest, NextResponse } from "next/server";

/**
 * Portfolio Q&A chat — proxies to the agent-service /chat (Profile-QA) endpoint,
 * which is grounded in Om's knowledge base and runs on the configured LLM.
 * (Previously called OpenAI directly; repointed so it shares the same working
 * backend as the consulting agents.)
 */
export async function POST(req: NextRequest) {
  const base = process.env.AGENT_SERVICE_URL;

  let body: { message?: string; history?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message || "").trim().slice(0, 1000);
  if (!message) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }
  if (!base) {
    return NextResponse.json({ error: "Chat agent is not configured (AGENT_SERVICE_URL missing)." }, { status: 503 });
  }

  try {
    const res = await fetch(`${base}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.AGENT_SERVICE_KEY ? { "x-service-key": process.env.AGENT_SERVICE_KEY } : {}),
      },
      body: JSON.stringify({
        message,
        history: (body.history ?? [])
          .slice(-8)
          .filter(m => ["user", "assistant"].includes(m.role) && typeof m.content === "string")
          .map(m => ({ role: m.role, content: String(m.content).slice(0, 2000) })),
      }),
      signal: AbortSignal.timeout(45_000),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.detail || "Chat agent error" }, { status: res.status });
    }
    // Backward-compatible shape: { text } for old callers, plus { answer }.
    return NextResponse.json({ text: data.answer ?? "", answer: data.answer ?? "" });
  } catch (e) {
    console.error("[chat] proxy error:", e);
    return NextResponse.json({ error: "Couldn't reach the chat agent." }, { status: 502 });
  }
}
