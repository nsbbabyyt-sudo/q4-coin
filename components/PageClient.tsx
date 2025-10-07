"use client";

import { useEffect, useState } from "react";
import StakePanel from "./StakePanel";
import { WalletContext } from "./WalletContext";
import WalletConnect from "./WalletConnect";
import LogoBubble from "./LogoBubble";
import StakeBox from "./StakeBox";

type Meta = { ok: boolean; lastRunAt: string | null; periodDays: number };

export default function PageClient() {
  const project = process.env.NEXT_PUBLIC_PROJECT_NAME || "Q4 Coin";
  const dexs = process.env.NEXT_PUBLIC_DEXS_URL || "about:blank";

  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/payout-meta")
      .then((r) => r.json())
      .then((data) => !cancelled && setMeta(data))
      .catch(() => !cancelled && setMeta({ ok: false, lastRunAt: null, periodDays: 7 }));
    return () => { cancelled = true; };
  }, []);

  function formatWhen(iso: string | null) {
    if (!iso) return "Not yet distributed";
    try { return new Date(iso).toLocaleString(); } catch { return String(iso); }
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
      <main className="min-h-screen bg-gradient-to-b from-black to-zinc-950 text-white">
        {/* Header */}
        <header className="relative">
          <div className="mx-auto max-w-6xl px-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm md:text-base font-semibold tracking-wide text-white/80">
                {project}
              </div>
              <div className="relative">
                <div className="inline-block rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-2 shadow-lg shadow-black/40">
                  <div className="translate-x-[-0.1rem] translate-y-[0.1rem] scale-[1.5] origin-top-right inline-block">
                    <WalletConnect />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-10 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-6">
            <LogoBubble variant="hero" />
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                Stake Q4. Earn weekly airdrops.
              </h1>
              <p className="text-white/70 max-w-prose">
                30% of creator fees shared pro-rata with stakers. Extra airdrop for wallets staking ≥1,000,000.
              </p>

              {/* Glowing + moving pill */}
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm shadow-lg shadow-black/40 animate-glow">
                <span className="text-sm font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--accent,#0A84FF)] to-white bg-[length:200%_100%] animate-shimmer">
                  CA coming soon
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main cards */}
        <section className="mx-auto max-w-6xl px-4 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tokenomics */}
            <div className="glow-card rounded-2xl p-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent,#0A84FF)]/30 bg-[var(--accent,#0A84FF)]/10 px-3 py-1 text-[var(--accent,#0A84FF)] text-xs font-semibold">
                Rewards & Airdrops
              </div>

              <h3 className="mt-3 text-lg font-semibold">Tokenomics</h3>
              <ul className="mt-2 text-sm text-white/80 space-y-2 leading-relaxed">
                <li>
                  <span className="font-medium text-[var(--accent,#0A84FF)]">Creator Fee Share —</span>{" "}
                  30% of creator fees split weekly among wallets with ≥ 100,000 staked (pro-rata).
                </li>
                <li>
                  <span className="font-medium">Special Airdrop —</span>{" "}
                  #1 trending Solana memecoin split equally among wallets with ≥ 1,000,000 staked.
                </li>
                <li>
                  <span className="font-medium">Timing —</span>{" "}
                  Randomized once per week to reduce gaming.
                </li>
                <li className="text-white/70">
                  <span className="font-medium">Staking —</span> Soft-stake (no lock). Sign once here.
                </li>
              </ul>

              {/* Status pill */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Last distribution</div>
                <div className="text-sm font-medium">
                  {meta ? formatWhen(meta.lastRunAt) : "Loading…"}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  {meta ? nextWindowHint(meta.lastRunAt, meta.periodDays) : ""}
                </div>
              </div>

              {/* Progress hint */}
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
                  <div className="h-full bg-[var(--accent,#0A84FF)]" style={{ width: "30%" }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-white/60">
                  <span>Creator fees</span>
                  <span>30% → Weekly Share</span>
                </div>
                <div className="mt-3">
                  <a href="#stake" className="inline-flex items-center gap-1 text-sm text-[var(--accent,#0A84FF)] hover:underline">
                    Register now <span aria-hidden>↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Stake */}
            <div id="stake" className="glow-card rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3">Stake</h3>
              <StakeBox />
            </div>

            {/* Market */}
            <div className="glow-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Market</h3>
                <a
                  href={dexs}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[var(--accent,#0A84FF)] hover:underline"
                >
                  Open ↗
                </a>
              </div>
              <div className="relative w-full overflow-hidden rounded-xl border border-white/10" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={dexs}
                  title="Dex chart"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  allow="clipboard-write; fullscreen"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-white/60">
            © {new Date().getFullYear()} {project} · v:CA-pill
          </div>
        </footer>
      </main>
    </WalletContext>
  );
}
