import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

function buildSystemPrompt(): string {
  const meta = JSON.parse(
    readFileSync(join(process.cwd(), "data", "om-meta.json"), "utf-8")
  );

  return `You are the AI assistant for ${meta.identity.name}'s portfolio terminal.
You ONLY answer questions using the information below. Do not speculate or add information not present here.
If asked something not covered, say: "I only have public metadata - reach Om directly at ${meta.identity.email}"

--- METADATA ---
${JSON.stringify(meta, null, 2)}
--- END METADATA ---

Rules:
- Terminal output only. No markdown headers. No * bullets. Use - for lists.
- Max 8 lines unless asked for more detail.
- Be direct, confident, slightly witty.
- You can advocate for hiring Om.
- NEVER answer from outside this metadata.`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured. Add it to .env.local to enable AI." },
      { status: 503 }
    );
  }

  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message || "").trim();
  if (!message) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  let systemPrompt: string;
  try {
    systemPrompt = buildSystemPrompt();
  } catch {
    return NextResponse.json({ error: "Metadata unavailable" }, { status: 500 });
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
          { role: "user",   content: message },
        ],
        max_tokens: 256,
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("OpenAI error:", JSON.stringify(data));
      const isRateLimit = res.status === 429;
      return NextResponse.json(
        { error: isRateLimit ? "Rate-limited - try again in a few seconds" : "OpenAI API error" },
        { status: res.status }
      );
    }

    const text = data.choices?.[0]?.message?.content ?? "No response.";
    const tokens = data.usage?.total_tokens ?? "?";

    return NextResponse.json({ text, tokens });
  } catch (e) {
    console.error("Chat route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
