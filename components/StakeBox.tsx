"use client";

import React, { useMemo, useState } from "react";

type Tab = "stake" | "unstake" | "claim";

const StakeBox: React.FC = () => {
  const [tab, setTab] = useState<Tab>("stake");
  const [amount, setAmount] = useState<string>("");

  const canSubmit = useMemo(() => {
    if (tab === "claim") return true;
    const v = Number(amount);
    return Number.isFinite(v) && v > 0;
  }, [tab, amount]);

  function onSubmit() {
    if (tab === "stake") {
      console.log("STAKE", amount);
      // TODO: call your stake action
    } else if (tab === "unstake") {
      console.log("UNSTAKE", amount);
      // TODO: call your unstake action
    } else {
      console.log("CLAIM");
      // TODO: call your claim action
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs (no select/summary—no triangles) */}
      <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => setTab("stake")}
          className={[
            "px-3 py-1.5 text-sm rounded-lg transition",
            tab === "stake" ? "bg-white/15 text-white shadow-inner" : "text-white/70 hover:text-white hover:bg-white/10",
          ].join(" ")}
        >
          Stake
        </button>
        <button
          type="button"
          onClick={() => setTab("unstake")}
          className={[
            "px-3 py-1.5 text-sm rounded-lg transition",
            tab === "unstake" ? "bg-white/15 text-white shadow-inner" : "text-white/70 hover:text-white hover:bg-white/10",
          ].join(" ")}
        >
          Unstake
        </button>
        <button
          type="button"
          onClick={() => setTab("claim")}
          className={[
            "px-3 py-1.5 text-sm rounded-lg transition",
            tab === "claim" ? "bg-white/15 text-white shadow-inner" : "text-white/70 hover:text-white hover:bg-white/10",
          ].join(" ")}
        >
          Claim
        </button>
      </div>

      {/* Amount input (hidden on claim) */}
      {tab !== "claim" && (
        <div className="space-y-2">
          <label className="block text-xs text-white/60">Amount</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent,#0A84FF)]/60"
            />
            <button
              type="button"
              onClick={() => setAmount("100")}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10"
            >
              Max
            </button>
          </div>
          <div className="text-xs text-white/50">Soft-stake: no lock. You can unstake anytime.</div>
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className={[
          "w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition btn-no-triangle",
          canSubmit
            ? "bg-[var(--accent,#0A84FF)]/90 hover:bg-[var(--accent,#0A84FF)] text-white"
            : "bg-white/10 text-white/50 cursor-not-allowed",
        ].join(" ")}
      >
        {tab === "stake" ? "Stake" : tab === "unstake" ? "Unstake" : "Claim"}
      </button>

      <div className="text-xs text-white/50">
        By continuing, you’ll sign a message to register your wallet for soft-staking eligibility.
      </div>
    </div>
  );
};

export default StakeBox;
