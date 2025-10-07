"use client";

import Countdown from "../components/Countdown";
import StakePanel from "../components/StakePanel";
import { WalletContext } from "../components/WalletContext";
import WalletConnect from "../components/WalletConnect";
import LogoBubble from "../components/LogoBubble";
import StakeBox from "../components/StakeBox";

export default function Page() {
  // Safe on client (NEXT_PUBLIC_* only)
  const project = process.env.NEXT_PUBLIC_PROJECT_NAME || "Q4 Coin";
  const dexs = process.env.NEXT_PUBLIC_DEXS_URL || "about:blank";

  return (
    <WalletContext>
      <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white space-y-10">
        {/* Header: custom connect button, top-right */}
        <header className="flex items-start justify-end pr-6 pt-4">
          <div className="mr-3 mt-2">
            <WalletConnect />
          </div>
        </header>

        {/* Hero */}
        <section className="flex justify-center">
          <LogoBubble variant="hero" />
        </section>

        {/* Countdown + Register panel */}
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
          <div className="glow-card p-4 rounded-2xl border border-white/10 bg-white/5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent,#0A84FF)]/40 bg-[var(--accent,#0A84FF)]/15 px-3 py-1 text-[var(--accent,#0A84FF)] text-xs font-semibold mb-3">
              Stake <span className="tabular-nums">1,000,000+</span> to join the weekly trending token airdrop
            </div>

            <h3 className="font-semibold mb-2">Tokenomics</h3>

            <ul className="text-sm text-white/80 space-y-2">
              <li>
                <span className="font-semibold text-[var(--accent,#0A84FF)]">Weekly Airdrop Pool —</span>{" "}
                30% of creator fees are routed weekly to holders.
              </li>
              <li>
                <span className="font-semibold">Snapshot —</span>{" "}
                Every <span className="font-semibold">Monday @ 6:00 PM CT</span> (first Monday after launch).
              </li>
              <li>
                <span className="font-semibold">Eligibility —</span>{" "}
                Hold <span className="font-semibold">≥ 1,000,000</span> tokens at snapshot.
              </li>
              <li>
                <span className="font-semibold">Distribution —</span>{" "}
                Pro-rata to eligible wallets. Sub-1M wallets still share creator fees pro-rata, but
                <span className="font-semibold"> not</span> the weekly airdrop.
              </li>
              <li>
                <span className="font-semibold">Staking (Q4 Phase) —</span>{" "}
                Soft-stake (no lock). Opt in once by signing a message here.
              </li>
              <li>
                <span className="font-semibold">Transparency —</span>{" "}
                We publish the snapshot addresses & balances and payout tx links after each drop.
              </li>
              <li>
                <span className="font-semibold">Exclusions —</span>{" "}
                Team/treasury, centralized exchange/pooled custody, and detected sybil/multi-wallet abuse.
              </li>
              <li className="text-white/70">
                <span className="font-semibold">Supply & Basics —</span>{" "}
                Ticker: Q4 · Decimals: 9 · Mint: <span className="text-white/60">[added at launch]</span>
              </li>
              <li className="text-white/70">
                <span className="font-semibold">Liquidity & Safety —</span>{" "}
                LP lock: <span className="text-white/60">[provider/link]</span> · Lock length: <span className="text-white/60">[X]</span> ·
                Mint authority: <span className="text-white/60">[renounced]</span> · Freeze authority: <span className="text-white/60">[disabled/renounced]</span>
              </li>
            </ul>

            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
                <div className="h-full bg-[var(--accent,#0A84FF)]" style={{ width: "30%" }} />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-white/60">
                <span>Creator fees</span>
                <span>30% → Weekly Airdrop</span>
              </div>
              <div className="mt-3">
                <a href="#stake" className="text-sm text-[var(--accent,#0A84FF)] hover:underline">
                  Register now ↗
                </a>
              </div>
            </div>
          </div>

          {/* STAKE (soft-stake box) */}
          <div className="glow-card p-4 rounded-2xl border border-white/10 bg-white/5">
            <StakeBox />
          </div>

          {/* MARKET / CHART (responsive 16:9) */}
          <div className="glow-card p-4 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="font-semibold mb-2">Market</h3>

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
