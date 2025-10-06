import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Returns:
// { ok:true, lastRunAt: string|null, periodDays: number }
export async function GET() {
  const meta = (await kv.get<{ lastRunAt?: string; periodDays?: number }>("payouts:meta")) || {};
  const lastRunAt = meta.lastRunAt ?? null;
  const periodDays = meta.periodDays ?? 7;
  return NextResponse.json({ ok: true, lastRunAt, periodDays });
}
