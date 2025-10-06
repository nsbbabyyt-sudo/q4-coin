"use client";

import Countdown from "../components/Countdown";
import StakePanel from "../components/StakePanel";
import { WalletContext } from "../components/WalletContext";
import WalletConnect from "../components/WalletConnect";
import LogoBubble from "../components/LogoBubble";
import StakeBox from "../components/StakeBox";
// If you added this earlier, it will render; otherwise safe to leave.
let LastDistribution: any;
try { LastDistribution = require("../components/LastDistribution").default; } catch { LastDistribution = () => null; }

export default function HomeClient() {
  const project = process.env.NEXT_PUBLIC_PROJECT_NAME || "Q4 Coin";
  const dexs = process.env.NEXT_PUBLIC_DEXS_URL || "about:blank";

  return (
    <WalletContext>
      <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white space-y-10">
        {/* Header: wallet connect, offset from corner */}
        <header className="flex items-start justify-end pr-6 pt-4">
          <div className="translate-x-[-6px] translate-y-[6px]">
            <WalletConnect />
          </div>
        </header>

        {/* Hero with logo + countdown (if you have it) */}
        <section className="px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-center">
            <LogoBubble label={project} />
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-semibold">Stake {project}</h1>
              <p className="text-zinc-300">Earn weekly distributions. Randomized snapshot; last run shown below.</p>
              <a href={dexs} target="_blank" className="underline text-zinc-300">View on Dexscreener</a>
              <div>
                <Countdown />
              </div>
            </div>
          </div>
        </section>

        {/* Stake box */}
        <section className="px-6">
          <div className="max-w-5xl mx-auto">
            <StakeBox />
            <div className="mt-4">
              <LastDistribution />
            </div>
          </div>
        </section>
      </main>
    </WalletContext>
  );
}