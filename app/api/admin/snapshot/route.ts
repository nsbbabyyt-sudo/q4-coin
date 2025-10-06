import { NextResponse } from "next/server";
import {
  getStake, putCreatorPayout, putSpecialPayout, getAllWalletsFromIndex
} from "@/lib/kv";

function weekKeyToday() { return new Date().toISOString().slice(0,10); }
function toNum(x: string | number) { return typeof x === "number" ? x : Number(x || 0); }

const TIER1_MIN = toNum(process.env.TIER1_MIN || "100000");   // 100k
const TIER2_MIN = toNum(process.env.AIRDROP_MIN || "1000000"); // 1M
const CREATOR_POOL_PCT = Number(process.env.CREATOR_POOL_PCT || "0.30");

export async function POST(req: Request) {
  // Auth
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    grossCreatorFees = "0",            // string number, e.g., "12.34"
    specialTokenSymbol = "TOPMEME",
    specialTokenTotal = "0",           // string number of tokens for Tier 2
    forceWeekKey
  } = body;

  const weekKey = forceWeekKey || weekKeyToday();

  // Collect wallets from index
  const wallets = await getAllWalletsFromIndex();

  // Build stakes
  const stakes: { wallet: string; stake: number }[] = [];
  for (const w of wallets) {
    const rec = await getStake(w);
    if (!rec) continue;
    const stake = toNum(rec.amount);
    stakes.push({ wallet: w, stake });
  }

  // Tier 1: Creator-fee pool pro-rata among >= TIER1_MIN
  const eligibleT1 = stakes.filter(s => s.stake >= TIER1_MIN);
  const sumT1 = eligibleT1.reduce((a, b) => a + b.stake, 0);
  const poolCreator = toNum(grossCreatorFees) * CREATOR_POOL_PCT;

  for (const { wallet, stake } of eligibleT1) {
    const share = sumT1 > 0 ? (poolCreator * (stake / sumT1)) : 0;
    await putCreatorPayout({
      weekKey,
      wallet,
      eligible: true,
      shareAmount: String(share),
      poolTotal: String(poolCreator),
      sumStakeEligible: String(sumT1),
    });
  }

  // Non-eligible T1 get explicit zero row (optional)
  for (const { wallet } of stakes.filter(s => s.stake < TIER1_MIN)) {
    await putCreatorPayout({
      weekKey,
      wallet,
      eligible: false,
      shareAmount: "0",
      poolTotal: String(poolCreator),
      sumStakeEligible: String(sumT1),
    });
  }

  // Tier 2: Special airdrop equal split among >= TIER2_MIN
  const eligibleT2 = stakes.filter(s => s.stake >= TIER2_MIN);
  const countT2 = eligibleT2.length;
  const totalSpecial = toNum(specialTokenTotal);
  const each = countT2 > 0 ? (totalSpecial / countT2) : 0;

  for (const { wallet } of eligibleT2) {
    await putSpecialPayout({
      weekKey,
      wallet,
      eligible: true,
      tokenSymbol: specialTokenSymbol,
      tokenAmount: String(each),
      totalTokenPool: String(totalSpecial),
      eligibleCount: countT2,
    });
  }
  // Non-eligible T2 explicit zero row (optional)
  for (const { wallet } of stakes.filter(s => s.stake < TIER2_MIN)) {
    await putSpecialPayout({
      weekKey,
      wallet,
      eligible: false,
      tokenSymbol: specialTokenSymbol,
      tokenAmount: "0",
      totalTokenPool: String(totalSpecial),
      eligibleCount: countT2,
    });
  }

  return NextResponse.json({
    ok: true,
    weekKey,
    creatorPool: { poolCreator: String(poolCreator), eligibleCount: eligibleT1.length, sumStakeEligible: String(sumT1) },
    specialAirdrop: { token: specialTokenSymbol, total: String(totalSpecial), eligibleCount: countT2, each: String(each) },
  });
}
