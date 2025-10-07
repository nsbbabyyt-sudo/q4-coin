"use client";
import { useEffect, useState } from "react";
type V = { sha: string; builtAt: string; url?: string; msg?: string };
export default function VersionStamp() {
  const [v, setV] = useState<V | null>(null);
  useEffect(() => { fetch("/api/version").then(r => r.json()).then(setV).catch(() => {}); }, []);
  if (!v) return null;
  return (
    <div className="fixed bottom-2 right-2 z-50 px-2 py-1 rounded-md border border-white/10 bg-black/60 text-[10px] text-white/70">
      <span>build </span><span className="font-mono">{v.sha}</span><span> • </span>
      <span>{new Date(v.builtAt).toLocaleString()}</span>
    </div>
  );
}