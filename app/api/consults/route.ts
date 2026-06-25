import { NextRequest, NextResponse } from "next/server";
import { getConsults } from "@/lib/consults-store";

// Admin-only: lists all consultation leads for the dashboard.
// Gated by ADMIN_KEY (sent as ?key= or x-admin-key header).
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
  const consults = await getConsults();
  return NextResponse.json({ consults });
}
