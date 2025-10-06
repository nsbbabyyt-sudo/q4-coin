"use client";
import { useEffect, useMemo, useState } from "react";

/**
 * Countdown to Oct 5, 2025 @ 6:00 PM Central Time (CDT).
 * If you need a different time, change TARGET_ISO below.
 */
const TARGET_ISO = "2025-10-05T18:00:00-05:00"; // 6:00 PM CT (CDT)

type Parts = { d: number; h: number; m: number; s: number };

function diffParts(ms: number): Parts {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { d, h, m, s };
}

export default function Countdown() {
  // Avoid SSR/client mismatch: render nothing until mounted.
  const [mounted, setMounted] = useState(false);
  const target = useMemo(() => new Date(TARGET_ISO).getTime(), []);
  const [remain, setRemain] = useState<Parts>({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    setMounted(true); // first client-only render happens after this
    const tick = () => {
      const now = Date.now();
      setRemain(diffParts(target - now));
    };
    tick(); // run once immediately
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!mounted) {
    // Prevents hydration errors by not rendering changing numbers on the server
    return <div className="text-2xl font-bold tracking-wide opacity-60">— d — h — m — s</div>;
  }

  const { d, h, m, s } = remain;

  return (
    <div className="text-2xl font-bold tracking-wide">
      {d}d {h}h {m}m {s}s
    </div>
  );
}
