"use client";

import Countdown from "../components/Countdown";
import StakePanel from "../components/StakePanel";
import { WalletContext } from "../components/WalletContext";
import WalletConnect from "../components/WalletConnect";
import LogoBubble from "../components/LogoBubble";
import StakeBox from "../components/StakeBox";
import { useEffect, useState } from "react";

type Meta = { ok: boolean; lastRunAt: string|null; periodDays: number };

export default function Page() {
  // Safe to read on client
  const project = process.env.NEXT_PUBLIC_PROJECT_NAME || "Q4 Coin";
  const dexs = process.env.NEXT_PUBLIC_DEXS_URL || "about:blank";

  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => {
    // Fetch last distribution time from public API
    fetch("/api/public/payout-meta")
      .then(r => r.json())
      .then(setMeta)
      .catch(() => setMeta({ ok: false, lastRunAt: null, periodDays: 7 }));
  }, []);

  function formatWhen(iso: string | null) {
    if (!iso) return "Not yet distributed";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso!;
    }
  }

  function nextWindowHint(iso: string | null, days: number) {
    if (!iso) return `Runs randomly once per ~${days} days to prevent gaming.`;
    try {
      const start = new Date(iso).getTime();
      const nextLatest = new Date(start + days * 24 * 60 * 60 * 1000);
      return `Next window will occur randomly before ~ ${nextLatest.toLocaleString()}.`;
    } catch {
      return `Runs randomly once per ~${days} days.`;
    }
  }

  return (
    <WalletContext>
      <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white space-y-10">
        {/* Header */}
        <header className="flex items-start justify-end pr-6 pt-4">
          <div className="mr-3 mt-2">
            <WalletConnect />
          </div>
        </header>

        {/* Hero */}
        <section className="flex justify-center">
          <LogoBubble variant="hero" />
        </section>

        {/* Countdown + (existing) Stake panel */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
          <div className="glow-card p-6 rounded-2xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold mb-2">Launch Countdown</h2>
            <Countdown />
            <p className="mt-2 text-sm text-white/70">Launch: Oct 5 (6:00 PM CT)</p>
          </div>

          <div id="stake" className="glow-card p-6 rounded-2xl border border-white/10 bg-white/5">
            <StakePanel />
          </div>
        </section>

        {/* Tokenomics + Stake + Market */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-10">
          {/* TOKENOMICS */}
          <div className="glow-card p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent,#0A84FF)]/40 bg-[var(--accent,#0A84FF)]/15 px-3 py-1 text-[var(--accent,#0A84FF)] text-xs font-semibold">
              Tier 1: ≥100,000 share 30% fees (pro-rata) · Tier 2: ≥1,000,000 get weekly top-meme airdrop
            </div>

            <h3 className="font-semibold">Tokenomics</h3>
            <ul className="text-sm text-white/80 space-y-2">
              <li>
                <span className="font-semibold text-[var(--accent,#0A84FF)]">Creator Fee Share —</span>{" "}
                30% of creator fees split weekly among wallets with ≥ 100,000 staked (pro-rata).
              </li>
              <li>
                <span className="font-semibold">Special Airdrop —</span>{" "}
                #1 trending Solana memecoin split equally among wallets with ≥ 1,000,000 staked.
              </li>
              <li>
                <span className="font-semibold">Distribution Timing —</span>{" "}
                Randomized once per week to reduce gaming. See “Last distribution” below.
              </li>
              <li className="text-white/70">
                <span className="font-semibold">Staking —</span>{" "}
                Soft-stake (no lock). Sign once here.
              </li>
            </ul>

            {/* Status pill for last run */}
            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Last distribution</div>
              <div className="text-sm font-medium">
                {meta ? formatWhen(meta.lastRunAt) : "Loading…"}
              </div>
              <div className="mt-1 text-xs text-white/60">
                {meta ? nextWindowHint(meta.lastRunAt, meta.periodDays) : ""}
              </div>
            </div>

            {/* little progress bar (static example) */}
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
                <div className="h-full bg-[var(--accent,#0A84FF)]" style={{ width: "30%" }} />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-white/60">
                <span>Creator fees</span>
                <span>30% → Weekly Share</span>
              </div>
              <div className="mt-3">
                <a href="#stake" className="text-sm text-[var(--accent,#0A84FF)] hover:underline">
                  Register now ↗
                </a>
              </div>
            </div>
          </div>

          {/* STAKE (iMessage-styled) */}
          <div className="glow-card p-4 rounded-2xl border border-white/10 bg-white/5">
            <StakeBox />
          </div>

          {/* MARKET / CHART (responsive 16:9) */}
          <div className="glow-card p-4 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="font-semibold mb-2">Market</h3>
            <div
              className="relative w-full overflow-hidden rounded-xl border border-white/10"
              style={{ paddingTop: "56.25%" }}
            >
              <iframe
                src={dexs}
                title="Dex chart"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                allow="clipboard-write; fullscreen"
              />
            </div>
            <div className="flex justify-end mt-2">
              <a href={dexs} target="_blank" className="text-sm text-[var(--accent,#0A84FF)] hover:underline" rel="noreferrer">
                Open chart ↗
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-white/60 py-6">
          © {new Date().getFullYear()} {project}
        </footer>
      </main>
    </WalletContext>
  );
}
