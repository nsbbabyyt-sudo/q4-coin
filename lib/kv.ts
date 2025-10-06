import { kv } from "@vercel/kv";

export type StakeRecord = {
  wallet: string;
  amount: string;
  updatedAt: string;
  lastAction: "stake" | "unstake";
  nonce: number;
};

/** ---- Stake state ---- */
export async function getStake(wallet: string): Promise<StakeRecord | null> {
  return (await kv.get<StakeRecord>(`stakes:${wallet}`)) ?? null;
}
export async function setStake(rec: StakeRecord) {
  await kv.set(`stakes:${rec.wallet}`, rec);
}
export async function initWalletIfMissing(wallet: string) {
  const existing = await getStake(wallet);
  if (existing) return existing;
  const fresh: StakeRecord = {
    wallet,
    amount: "0",
    updatedAt: new Date().toISOString(),
    lastAction: "unstake",
    nonce: 1,
  };
  await setStake(fresh);
  return fresh;
}

/** ---- Events (optional audit) ---- */
export async function appendEvent(weekKey: string, wallet: string, event: any) {
  await kv.rpush(`stake_events:${weekKey}:${wallet}`, JSON.stringify(event));
}

/** ---- Creator-fee payouts (Tier 1) ---- */
export type CreatorPayout = {
  weekKey: string;
  wallet: string;
  eligible: boolean;
  shareAmount: string;     // amount of creator-fee pool this wallet can claim (string number)
  poolTotal: string;       // total pool for transparency
  sumStakeEligible: string;// sum of all eligible stakes for pro-rata calc
  claimedAt?: string | null;
};
export async function putCreatorPayout(row: CreatorPayout) {
  await kv.set(`creator_payouts:${row.weekKey}:${row.wallet}`, row);
}
export async function getCreatorPayout(weekKey: string, wallet: string) {
  return (await kv.get<CreatorPayout>(`creator_payouts:${weekKey}:${wallet}`)) ?? null;
}
export async function markCreatorClaimed(weekKey: string, wallet: string) {
  const r = await getCreatorPayout(weekKey, wallet);
  if (!r || !r.eligible) return null;
  if (r.claimedAt) return r;
  const updated = { ...r, claimedAt: new Date().toISOString() };
  await putCreatorPayout(updated);
  return updated;
}

/** ---- Special airdrop payouts (Tier 2) ---- */
export type SpecialPayout = {
  weekKey: string;
  wallet: string;
  eligible: boolean;
  tokenSymbol: string;     // e.g. TOPMEME
  tokenAmount: string;     // how many of the trending token this wallet can claim
  totalTokenPool: string;  // total tokens distributed
  eligibleCount: number;   // number of eligible wallets
  claimedAt?: string | null;
};
export async function putSpecialPayout(row: SpecialPayout) {
  await kv.set(`special_payouts:${row.weekKey}:${row.wallet}`, row);
}
export async function getSpecialPayout(weekKey: string, wallet: string) {
  return (await kv.get<SpecialPayout>(`special_payouts:${weekKey}:${wallet}`)) ?? null;
}
export async function markSpecialClaimed(weekKey: string, wallet: string) {
  const r = await getSpecialPayout(weekKey, wallet);
  if (!r || !r.eligible) return null;
  if (r.claimedAt) return r;
  const updated = { ...r, claimedAt: new Date().toISOString() };
  await putSpecialPayout(updated);
  return updated;
}

/** ---- Utility to list all stakers (for snapshot) ----
 * NOTE: Upstash KV does not support listing keys without a separate index.
 * For week 1, we’ll read from a maintained set. You can push wallets to an index when they first stake.
 */
export async function addWalletToIndex(wallet: string) {
  await kv.sadd("stakes:index:wallets", wallet);
}
export async function getAllWalletsFromIndex(): Promise<string[]> {
  return (await kv.smembers<string[]>("stakes:index:wallets")) || [];
}
