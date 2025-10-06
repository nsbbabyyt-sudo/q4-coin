// app/api/register/route.ts
import { NextResponse } from "next/server";
import {
  getStake,
  setStake,
  appendEvent,
  initWalletIfMissing,
  addWalletToIndex,
} from "@/lib/kv";
import { verifySolanaDetachedSignature } from "@/utils/solana";

/** Envelope received from client */
type SignedEnvelope = {
  message: string;   // exact JSON string that was signed
  signature: string; // base58 signature
};

/** Message that the wallet signs */
type SoftStakeMessage = {
  domain: string;                         // must equal NEXT_PUBLIC_SITE_ORIGIN
  purpose: "soft-stake";                  // fixed
  wallet: string;                         // base58
  action: "stake" | "unstake" | "claim";  // we accept claim intents but don't finalize here
  amount: string;                         // integer-as-string
  nonce: number;                          // must match KV's next expected nonce
  issuedAt: string;                       // ISO
  expiresAt: string;                      // ISO (5–10 min window)
};

function safeParse<T>(s: string): T | null {
  try { return JSON.parse(s) as T; } catch { return null; }
}

function withinWindow(issuedAt: string, expiresAt: string) {
  const now = Date.now();
  const i = Date.parse(issuedAt);
  const e = Date.parse(expiresAt);
  return Number.isFinite(i) && Number.isFinite(e) && i <= now && now <= e;
}

const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "";

export async function POST(req: Request) {
  try {
    const { envelope }: { envelope: SignedEnvelope } = await req.json();

    if (!envelope?.message || !envelope?.signature) {
      return NextResponse.json({ ok: false, error: "missing envelope" }, { status: 400 });
    }

    const msg = safeParse<SoftStakeMessage>(envelope.message);
    if (!msg) {
      return NextResponse.json({ ok: false, error: "bad message json" }, { status: 400 });
    }

    // Basic schema/domain checks
    if (!ORIGIN) {
      return NextResponse.json({ ok: false, error: "server missing NEXT_PUBLIC_SITE_ORIGIN" }, { status: 500 });
    }
    if (msg.domain !== ORIGIN) {
      return NextResponse.json({ ok: false, error: "domain mismatch" }, { status: 400 });
    }
    if (msg.purpose !== "soft-stake") {
      return NextResponse.json({ ok: false, error: "bad purpose" }, { status: 400 });
    }
    if (!withinWindow(msg.issuedAt, msg.expiresAt)) {
      return NextResponse.json({ ok: false, error: "expired" }, { status: 400 });
    }

    // Ensure wallet record exists and check nonce
    await initWalletIfMissing(msg.wallet);
    const rec = await getStake(msg.wallet);
    if (!rec) {
      return NextResponse.json({ ok: false, error: "wallet init failed" }, { status: 500 });
    }
    if (msg.nonce !== rec.nonce) {
      return NextResponse.json({ ok: false, error: `nonce mismatch (expected ${rec.nonce})` }, { status: 409 });
    }

    // Verify signature for exact message string
    const verified = verifySolanaDetachedSignature({
      message: envelope.message,
      signatureBase58: envelope.signature,
      publicKeyBase58: msg.wallet,
    });
    if (!verified) {
      return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
    }

    // Apply action
    let newAmount = rec.amount;
    let lastAction = rec.lastAction;

    if (msg.action === "stake") {
      newAmount = msg.amount;
      lastAction = "stake";
    } else if (msg.action === "unstake") {
      newAmount = "0";
      lastAction = "unstake";
    } else if (msg.action === "claim") {
      // We accept signed claim intent but do not finalize here.
      // Actual claim logic should
