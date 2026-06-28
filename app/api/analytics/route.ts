import { NextRequest, NextResponse } from "next/server";
import { getSummary } from "@/lib/analytics-store";

// Admin-only: aggregated visitor analytics for the portal.
// Gated by ADMIN_KEY (sent as ?key= or x-admin-key header) — same as /api/consults.
function authorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return false; // locked until an admin key is configured
  const provided =
    req.headers.get("x-admin-key") ??
    req.nextUrl.searchParams.get("key") ??
    "";
  return provided === expected;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const summary = await getSummary(Date.now());
  return NextResponse.json(summary);
}
