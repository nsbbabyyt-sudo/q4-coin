import { NextResponse } from "next/server";
import { markCreatorClaimed, markSpecialClaimed } from "@/lib/kv";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { kind = "creator", weekKey, wallet } = await req.json().catch(() => ({}));
  if (!weekKey || !wallet) {
    return NextResponse.json({ ok: false, error: "weekKey and wallet required" }, { status: 400 });
  }

  if (kind === "creator") {
    const r = await markCreatorClaimed(weekKey, wallet);
    if (!r) return NextResponse.json({ ok: false, error: "not eligible or already claimed" }, { status: 400 });
    return NextResponse.json({ ok: true, claimed: r });
  } else if (kind === "special") {
    const r = await markSpecialClaimed(weekKey, wallet);
    if (!r) return NextResponse.json({ ok: false, error: "not eligible or already claimed" }, { status: 400 });
    return NextResponse.json({ ok: true, claimed: r });
  } else {
    return NextResponse.json({ ok: false, error: "invalid kind" }, { status: 400 });
  }
}
