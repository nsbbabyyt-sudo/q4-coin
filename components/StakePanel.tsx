"use client";

import { useEffect, useState } from "react";
import Countdown from "./Countdown";

/**
 * Hydration-safe StakePanel:
 * - Shows a static placeholder on the server
 * - Renders the live <Countdown /> only after the client mounts
 * - No logic changes beyond hydration safety
 */
export default function StakePanel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold mb-1">Register</h2>

      {/* Hydration-safe countdown slot */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        {mounted ? (
          <Countdown />
        ) : (
          <div className="text-2xl font-bold tracking-wide opacity-60">— d — h — m — s</div>
        )}
        <p className="mt-1 text-sm text-white/70">Launch: Oct 5 (6:00 PM CT)</p>
      </div>

      {/* Keep whatever explanatory text or controls you had here */}
      <p className="text-sm text-white/70">
        Sign once to register your wallet for staking eligibility. You can also use the new Stake box on the right.
      </p>
    </div>
  );
}
