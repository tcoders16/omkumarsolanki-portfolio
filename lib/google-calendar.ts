/**
 * Google Calendar booking via OAuth (acts as Om).
 * Needs GOOGLE_OAUTH_CLIENT_ID / SECRET / REFRESH_TOKEN (mint the refresh token
 * once via /api/google/connect). Creates events directly on Om's calendar and
 * lets Google send the invite. Times are wall-clock America/Toronto (Google
 * resolves DST), so no manual UTC offset for inserts.
 */
import { google } from "googleapis";

const TZ = "America/Toronto";
const CAL = () => process.env.GOOGLE_CALENDAR_ID || "primary";

function oauthClient() {
  const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI, GOOGLE_OAUTH_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET || !GOOGLE_OAUTH_REFRESH_TOKEN) return null;
  const c = new google.auth.OAuth2(GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI);
  c.setCredentials({ refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN });
  return c;
}

export function isConnected(): boolean {
  return !!oauthClient();
}

// True UTC offset (minutes) for America/Toronto on a given instant — handles DST.
function tzOffsetMin(at: Date): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" })
    .formatToParts(at).find(p => p.type === "timeZoneName")?.value || "GMT+00:00";
  const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

// Wall-clock ET (date "YYYY-MM-DD", slot "HH:MM") → exact UTC Date.
function etInstant(date: string, slot: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = slot.split(":").map(Number);
  const guess = new Date(Date.UTC(y, mo - 1, d, h, mi));
  return new Date(guess.getTime() - tzOffsetMin(guess) * 60000);
}

/** Is the 30-min slot already busy on the calendar? */
export async function isSlotBusy(date: string, slot: string): Promise<boolean> {
  const auth = oauthClient();
  if (!auth) throw new Error("Google Calendar not connected");
  const start = etInstant(date, slot);
  const end = new Date(start.getTime() + 30 * 60000);
  const cal = google.calendar({ version: "v3", auth });
  const r = await cal.freebusy.query({
    requestBody: { timeMin: start.toISOString(), timeMax: end.toISOString(), items: [{ id: CAL() }] },
  });
  const busy = r.data.calendars?.[CAL()]?.busy ?? [];
  return busy.length > 0;
}

/** Create a 30-min event on Om's calendar and invite the booker. */
export async function createBooking(opts: {
  date: string; slot: string; name: string; email: string; note?: string;
}): Promise<{ id?: string | null; link?: string | null }> {
  const auth = oauthClient();
  if (!auth) throw new Error("Google Calendar not connected");
  const [h, mi] = opts.slot.split(":").map(Number);
  const endMin = h * 60 + mi + 30;
  const endSlot = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
  const cal = google.calendar({ version: "v3", auth });
  const r = await cal.events.insert({
    calendarId: CAL(),
    sendUpdates: "all",
    requestBody: {
      summary: `30-min AI strategy call — Om × ${opts.name}`,
      description: opts.note || "Booked via omkumarsolanki.com",
      start: { dateTime: `${opts.date}T${opts.slot}:00`, timeZone: TZ },
      end: { dateTime: `${opts.date}T${endSlot}:00`, timeZone: TZ },
      attendees: opts.email ? [{ email: opts.email }] : undefined,
    },
  });
  return { id: r.data.id, link: r.data.htmlLink };
}
