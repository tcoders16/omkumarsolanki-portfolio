/**
 * SSE endpoint — every connected browser gets live booking updates.
 * Uses Server-Sent Events (server → client push), which is the correct
 * tool for real-time broadcast; WebRTC would be needed for P2P media.
 */
export const dynamic = "force-dynamic";
export const runtime  = "nodejs";

import { NextRequest } from "next/server";
import { sseSubs, getBookings, broadcastWatchers } from "@/lib/bookings-store";

const enc = new TextEncoder();

export async function GET(req: NextRequest) {
  let ctrl: ReadableStreamDefaultController<Uint8Array>;

  const stream = new ReadableStream<Uint8Array>({
    async start(c) {
      ctrl = c;
      sseSubs.add(c);

      // Send current state immediately
      const bookings = await getBookings();
      c.enqueue(enc.encode(
        `data: ${JSON.stringify({ type: "init", bookings })}\n\n`
      ));

      // Broadcast updated watcher count to everyone
      broadcastWatchers();

      // Keep-alive ping every 20 s (prevents proxy timeout)
      const ping = setInterval(() => {
        try   { c.enqueue(enc.encode(": ping\n\n")); }
        catch { clearInterval(ping); }
      }, 20_000);

      req.signal.addEventListener("abort", () => {
        clearInterval(ping);
        sseSubs.delete(c);
        broadcastWatchers();
        try { c.close(); } catch {}
      });
    },
    cancel() {
      sseSubs.delete(ctrl);
      broadcastWatchers();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection":    "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
