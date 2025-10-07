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
  if (!iso) return Runs randomly once per ~ days to prevent gaming.;
  try {
    const start = new Date(iso).getTime();
    const nextLatest = new Date(start + days * 24 * 60 * 60 * 1000);
    return Next window will occur randomly before ~ .;
  } catch {
    return Runs randomly once per ~ days.;
  }
}

