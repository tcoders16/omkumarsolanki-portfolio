import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const RATE_STORE = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 7;
const WINDOW_MS  = 60 * 60 * 1000; // 1 hour

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

function buildSystemPrompt(): string {
  // Load structured meta
  const meta = JSON.parse(
    readFileSync(join(process.cwd(), "data", "om-meta.json"), "utf-8")
  );

  // Load the full portfolio knowledge base (page-indexed MD file)
  let portfolioKnowledge = "";
  try {
    portfolioKnowledge = readFileSync(
      join(process.cwd(), "public", "knowledge", "portfolio.md"),
      "utf-8"
    );
  } catch {
    // fallback gracefully if file missing
    portfolioKnowledge = "";
  }

  const useCaseBlock = meta.use_cases.map((uc: {
    problem: string; solution: string; reference: string; result: string;
  }) =>
    `  PROBLEM: "${uc.problem}"\n  → SOLUTION: ${uc.solution}\n  → Om's proof: ${uc.reference}\n  → Outcome for client: ${uc.result}`
  ).join("\n\n");

  return `You are an AI assistant embedded in Om Kumar Solanki's portfolio website. You have two roles:

1. **Answer any question** about Om's background, projects, tech stack, services, process, and experience. Be specific, accurate, and helpful.
2. **Qualify potential clients** — if someone describes a business problem, match it to Om's work and guide them to book a free strategy call.

---

PORTFOLIO KNOWLEDGE BASE:
${portfolioKnowledge}

---

OM'S PROVEN RESULTS (key metrics):
${Object.entries(meta.metrics).map(([k, v]) => `  • ${k.replace(/_/g, " ")}: ${v}`).join("\n")}

PROBLEM → SOLUTION MAP:
${useCaseBlock}

---

CONVERSATION RULES:

For general questions (about Om, his work, tech, projects, process):
- Answer directly and specifically using the knowledge base above
- Be concise but complete — 2–4 sentences per answer
- Reference specific projects and real numbers when relevant

For business inquiries (someone has a problem to solve):
1. First message: understand what their business does and the biggest manual/slow process
2. Second message: match to Om's specific project + metric. Ask one qualifying question
3. Third message: tie to concrete ROI. End with the booking CTA

IMPORTANT RULES:
- NEVER reveal pricing. Say "we scope that on the free call."
- NEVER fabricate metrics. Only use verified numbers above.
- Keep responses to 3–5 sentences max.
- When visitor is ready to book, end your message with [READY_TO_BOOK] as the very last characters.
- Answer questions about the portfolio naturally — visitors are researching Om and deserve clear answers.
- If asked about something you don't know, direct them to email: emailtosolankiom@gmail.com`;
}

export async function POST(req: NextRequest) {
  // IP-based rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: "Rate limit reached. Reach Om directly at emailtosolankiom@gmail.com" },
      { status: 429 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured." }, { status: 503 });
  }

  let body: { message?: string; history?: { role: string; content: string }[] };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message || "").trim().slice(0, 500);
  if (!message) return NextResponse.json({ error: "No message" }, { status: 400 });

  // Sanitise history
  const safeHistory = (body.history ?? [])
    .slice(-10)
    .filter(m => ["user", "assistant"].includes(m.role) && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 500) }));

  let systemPrompt: string;
  try { systemPrompt = buildSystemPrompt(); } catch {
    return NextResponse.json({ error: "Advisor unavailable" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...safeHistory,
          { role: "user", content: message },
        ],
        max_tokens: 280,
        temperature: 0.5,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("OpenAI business-chat error:", data);
      return NextResponse.json({ error: "AI error" }, { status: res.status });
    }

    let text: string = data.choices?.[0]?.message?.content ?? "Sorry, try again.";

    // Detect booking trigger — strip token, set flag
    let showBooking = false;
    if (text.includes("[READY_TO_BOOK]")) {
      showBooking = true;
      text = text.replace("[READY_TO_BOOK]", "").trimEnd();
    }

    return NextResponse.json({ text, showBooking });
  } catch (e) {
    console.error("business-chat route error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
