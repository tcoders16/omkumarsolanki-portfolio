/**
 * Consultation-lead store backed by Upstash Redis.
 * Falls back to in-memory (dev) when env vars are not set.
 * Mirrors lib/bookings-store.ts so the admin dashboard reads from one place.
 */
import { Redis } from "@upstash/redis";

export type ConsultTrace = { agent: string; label: string };

export type ConsultLead = {
  id: string;
  company: string;
  industry: string;
  whatTheyDo: string;
  problem: string;
  // Router classification
  intent: string;
  domain: string;
  urgency: string;
  // Outcome
  matched: boolean;
  reference?: string; // Om's proof (matched case)
  solution?: string;
  result?: string;
  answer: string;
  trace: ConsultTrace[];
  createdAt: string; // ISO timestamp
};

const REDIS_KEY = "portfolio:consults";

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
const g = globalThis as typeof globalThis & { __consults?: ConsultLead[] };
if (!g.__consults) g.__consults = [];

export async function getConsults(): Promise<ConsultLead[]> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get<ConsultLead[]>(REDIS_KEY);
    return raw ?? [];
  }
  return g.__consults!;
}

export async function getConsult(id: string): Promise<ConsultLead | null> {
  const all = await getConsults();
  return all.find(c => c.id === id) ?? null;
}

export async function addConsult(lead: ConsultLead): Promise<void> {
  const redis = getRedis();
  if (redis) {
    const current = await getConsults();
    current.unshift(lead); // newest first
    await redis.set(REDIS_KEY, current);
  } else {
    g.__consults!.unshift(lead);
  }
}
