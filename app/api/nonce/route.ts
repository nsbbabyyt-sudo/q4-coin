import { NextResponse } from "next/server";
import { initWalletIfMissing } from "@/lib/kv";

export async function POST(req: Request) {
  const { wallet } = await req.json();
  if (!wallet || typeof wallet !== "string") {
    return NextResponse.json({ ok: false, error: "wallet required" }, { status: 400 });
  }
  const rec = await initWalletIfMissing(wallet);
  return NextResponse.json({ ok: true, nonce: rec.nonce });
}
