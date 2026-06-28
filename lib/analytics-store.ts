/**
 * Visitor-analytics store backed by Upstash Redis.
 * Falls back to in-memory (dev) when env vars are not set.
 * Mirrors lib/consults-store.ts so the admin portal reads from one place.
 *
 * Design: a single capped event log. Everything the dashboard shows
 * (live visitors, daily series, top pages, sessions) is derived from it.
 */
import { Redis } from "@upstash/redis";

export type AnalyticsEvent = {
  id: string;
  sid: string;                 // anonymous session id (set client-side)
  type: "pageview" | "click" | "section" | "heartbeat";
  path: string;                // page path, e.g. "/consulting"
  label?: string;              // click target / section name
  ref?: string;                // referrer host on the first hit
  device?: "mobile" | "tablet" | "desktop";
  ts: number;                  // epoch ms
};

const REDIS_KEY = "portfolio:analytics";
const MAX_EVENTS = 8000;       // ring-buffer cap (keeps Redis payload small)
const LIVE_WINDOW = 5 * 60_000; // "online now" = active within 5 min

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) return null;
  return new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// In-memory fallback (dev) — survives HMR via globalThis.
const g = globalThis as typeof globalThis & { __analytics?: AnalyticsEvent[] };
if (!g.__analytics) g.__analytics = [];

export async function getEvents(): Promise<AnalyticsEvent[]> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get<AnalyticsEvent[]>(REDIS_KEY);
    return raw ?? [];
  }
  return g.__analytics!;
}

export async function addEvent(ev: AnalyticsEvent): Promise<void> {
  const redis = getRedis();
  if (redis) {
    const current = await getEvents();
    current.unshift(ev);                       // newest first
    if (current.length > MAX_EVENTS) current.length = MAX_EVENTS;
    await redis.set(REDIS_KEY, current);
  } else {
    g.__analytics!.unshift(ev);
    if (g.__analytics!.length > MAX_EVENTS) g.__analytics!.length = MAX_EVENTS;
  }
}

// ── Aggregation ────────────────────────────────────────────────────────────────

export type SessionSummary = {
  sid: string;
  device?: string;
  ref?: string;
  pages: string[];          // distinct paths, in visit order
  views: number;
  clicks: number;
  firstTs: number;
  lastTs: number;
  live: boolean;
};

export type AnalyticsSummary = {
  totals:    { views: number; sessions: number; clicks: number };
  today:     { views: number; sessions: number };
  liveCount: number;
  series:    { day: string; views: number; sessions: number }[]; // last 14 days, oldest→newest
  topPages:     { key: string; count: number }[];
  topClicks:    { key: string; count: number }[];
  topReferrers: { key: string; count: number }[];
  devices:      { key: string; count: number }[];
  sessions:  SessionSummary[]; // most recent first
  generatedAt: number;
};

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function tally(items: (string | undefined)[]): { key: string; count: number }[] {
  const m = new Map<string, number>();
  for (const it of items) {
    if (!it) continue;
    m.set(it, (m.get(it) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getSummary(nowTs: number): Promise<AnalyticsSummary> {
  const events = await getEvents();

  const views  = events.filter(e => e.type === "pageview");
  const clicks = events.filter(e => e.type === "click");
  const sessionIds = new Set(events.map(e => e.sid));

  const todayKey = dayKey(nowTs);
  const todayViews = views.filter(e => dayKey(e.ts) === todayKey);
  const todaySessions = new Set(todayViews.map(e => e.sid));

  // Live = distinct sessions with any event in the last LIVE_WINDOW.
  const liveSids = new Set(
    events.filter(e => nowTs - e.ts < LIVE_WINDOW).map(e => e.sid),
  );

  // 14-day series.
  const series: AnalyticsSummary["series"] = [];
  for (let i = 13; i >= 0; i--) {
    const key = dayKey(nowTs - i * 86_400_000);
    const dayViews = views.filter(e => dayKey(e.ts) === key);
    series.push({
      day: key,
      views: dayViews.length,
      sessions: new Set(dayViews.map(e => e.sid)).size,
    });
  }

  // Per-session rollup (cap to keep response small).
  const bySid = new Map<string, AnalyticsEvent[]>();
  for (const e of events) {
    if (!bySid.has(e.sid)) bySid.set(e.sid, []);
    bySid.get(e.sid)!.push(e);
  }
  const sessions: SessionSummary[] = [...bySid.entries()]
    .map(([sid, evs]) => {
      const ordered = [...evs].sort((a, b) => a.ts - b.ts);
      const pages: string[] = [];
      for (const e of ordered) {
        if (e.type === "pageview" && pages[pages.length - 1] !== e.path) {
          pages.push(e.path);
        }
      }
      const ref = ordered.find(e => e.ref)?.ref;
      const device = ordered.find(e => e.device)?.device;
      return {
        sid,
        device,
        ref,
        pages,
        views:  evs.filter(e => e.type === "pageview").length,
        clicks: evs.filter(e => e.type === "click").length,
        firstTs: ordered[0].ts,
        lastTs:  ordered[ordered.length - 1].ts,
        live: liveSids.has(sid),
      };
    })
    .sort((a, b) => b.lastTs - a.lastTs)
    .slice(0, 100);

  return {
    totals:    { views: views.length, sessions: sessionIds.size, clicks: clicks.length },
    today:     { views: todayViews.length, sessions: todaySessions.size },
    liveCount: liveSids.size,
    series,
    topPages:     tally(views.map(e => e.path)).slice(0, 10),
    topClicks:    tally(clicks.map(e => e.label)).slice(0, 10),
    topReferrers: tally(events.map(e => e.ref)).slice(0, 8),
    devices:      tally(events.map(e => e.device)),
    sessions,
    generatedAt: nowTs,
  };
}
