import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Body:
// { lastRunAt?: string, periodDays?: number }
// If lastRunAt missing, server uses "now".
export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const nowIso = new Date().toISOString();

  const lastRunAt: string = typeof body.lastRunAt === "string" ? body.lastRunAt : nowIso;
  const periodDays: number = Number.isFinite(body.periodDays) ? Number(body.periodDays) : 7;

  await kv.set("payouts:meta", { lastRunAt, periodDays });

  return NextResponse.json({ ok: true, lastRunAt, periodDays });
}
