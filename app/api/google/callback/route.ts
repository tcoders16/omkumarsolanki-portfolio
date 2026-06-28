export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { promises as fs } from "fs";
import path from "path";

function page(title: string, body: string, ok = false) {
  return new NextResponse(
    `<html><body style="font-family:ui-monospace,monospace;background:#0a0a0a;color:#ededed;padding:48px;line-height:1.7">
      <h2 style="color:${ok ? "#39d9b4" : "#f87171"};font-size:15px;letter-spacing:.08em;text-transform:uppercase">${title}</h2>
      <div style="font-size:13px;color:#c8c4bc;max-width:620px">${body}</div>
    </body></html>`,
    { headers: { "content-type": "text/html" } }
  );
}

/** Exchanges the OAuth code for a refresh token and writes it into .env.local (dev). */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const err = req.nextUrl.searchParams.get("error");
  if (err) return page("Authorization declined", `Google returned: ${err}. Try again at <a style="color:#39d9b4" href="/api/google/connect">/api/google/connect</a>.`);
  if (!code) return page("Missing code", "No ?code from Google. Restart at /api/google/connect.");

  const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI } = process.env;
  try {
    const oauth2 = new google.auth.OAuth2(GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI);
    const { tokens } = await oauth2.getToken(code);
    const refresh = tokens.refresh_token;
    if (!refresh) {
      return page("No refresh token", "Google didn't return a refresh token (already authorized). Revoke access at <a style='color:#39d9b4' href='https://myaccount.google.com/permissions'>myaccount.google.com/permissions</a>, then retry /api/google/connect.");
    }
    // Persist to .env.local (gitignored). Keeps the token out of the browser/logs.
    const envPath = path.join(process.cwd(), ".env.local");
    let env = await fs.readFile(envPath, "utf8").catch(() => "");
    if (/^GOOGLE_OAUTH_REFRESH_TOKEN=.*$/m.test(env)) {
      env = env.replace(/^GOOGLE_OAUTH_REFRESH_TOKEN=.*$/m, `GOOGLE_OAUTH_REFRESH_TOKEN=${refresh}`);
    } else {
      env += `${env.endsWith("\n") ? "" : "\n"}GOOGLE_OAUTH_REFRESH_TOKEN=${refresh}\n`;
    }
    await fs.writeFile(envPath, env);
    return page(
      "Google Calendar connected",
      "Refresh token saved to <b>.env.local</b>. <b>Restart the dev server</b> and bookings will create events directly on your Google Calendar. You can close this tab.",
      true
    );
  } catch (e) {
    return page("Token exchange failed", String(e instanceof Error ? e.message : e));
  }
}
