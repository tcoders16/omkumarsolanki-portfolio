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
  const meta = JSON.parse(
    readFileSync(join(process.cwd(), "data", "om-meta.json"), "utf-8")
  );

  const useCaseBlock = meta.use_cases.map((uc: {
    problem: string; solution: string; reference: string; result: string;
  }) =>
    `  PROBLEM: "${uc.problem}"\n  → SOLUTION: ${uc.solution}\n  → Om's proof: ${uc.reference}\n  → Outcome for client: ${uc.result}`
  ).join("\n\n");

  return `You are an AI business advisor on Om Kumar Solanki's consulting portfolio. Your ONLY goal is to qualify the visitor's business problem, match it to Om's real work, and guide them to book a free strategy call.

WHO OM IS:
- ${meta.identity.role} based in ${meta.identity.location}
- ${meta.personality}
- Email: ${meta.identity.email}
- Booking: ${meta.booking.cal}

OM'S PROVEN RESULTS (use these numbers when relevant):
${Object.entries(meta.metrics).map(([k, v]) => `  • ${k.replace(/_/g, " ")}: ${v}`).join("\n")}

PROBLEM → SOLUTION MAP (always reference Om's specific work):
${useCaseBlock}

CONVERSATION RULES:
1. First message: ask what their business does and the biggest manual/slow process they deal with.
2. Second message: pick the closest use case above and reference Om's exact project + metric. Then ask ONE qualifying question (team size, current tool, or urgency).
3. Third message: tie their answer to a concrete ROI (time saved, cost cut, or accuracy gain). Then end with [READY_TO_BOOK].
4. Every message after the third: keep helping, and always end with [READY_TO_BOOK].

IMPORTANT RULES:
- NEVER reveal pricing. Say "we scope that on the free call."
- NEVER use vague AI buzzwords. Be specific to their industry.
- NEVER fabricate metrics. Only use numbers from Om's actual work above.
- Keep each response to 3–5 sentences max.
- Always end your response with a single concrete question OR the booking trigger.
- When you include [READY_TO_BOOK] it must appear as the very last characters of your message, on its own — do not put anything after it.
- Only discuss business, AI, and how Om can help. Decline anything else politely.`;
}

export async function POST(req: NextRequest) {
  // IP-based rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: "Rate limit reached. Reach Om directly at om@resso.ai" },
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
        max_tokens: 220,
        temperature: 0.55,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("OpenAI business-chat error:", data);
      return NextResponse.json({ error: "AI error" }, { status: res.status });
    }

    let text: string = data.choices?.[0]?.message?.content ?? "Sorry, try again.";

    // Detect agentic booking trigger — strip token, set flag
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
