"use client";
import { useEffect, useMemo, useState } from "react";

/** time helpers */
function nowISO() { return new Date().toISOString(); }
function addMinutes(dateIso: string, min: number) {
  return new Date(new Date(dateIso).getTime() + min * 60000).toISOString();
}

/** API helpers */
async function getNonce(wallet: string) {
  const res = await fetch("/api/nonce", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "nonce failed");
  return json.nonce as number;
}

async function signAndSend(params: {
  wallet: string;
  action: "stake" | "unstake";
  amount: string;
  domain: string;
  nonce: number;
}) {
  const messageObj = {
    domain: params.domain,
    purpose: "soft-stake" as const,
    wallet: params.wallet,
    action: params.action,
    amount: params.amount,
    nonce: params.nonce,
    issuedAt: nowISO(),
    expiresAt: addMinutes(nowISO(), 10),
  };
  const messageStr = JSON.stringify(messageObj);

  // Phantom/Backpack sign
  const provider = (window as any).solana;
  if (!provider?.isPhantom && !provider?.isBackpack) {
    throw new Error("Open in Phantom or Backpack");
  }

  const enc = new TextEncoder();
  const signed = await provider.signMessage(enc.encode(messageStr), "utf8");
  const sigRaw = signed.signature ?? signed;
  const signatureBase58 =
    typeof sigRaw === "string" ? sigRaw : window.btoa(String.fromCharCode(...sigRaw));

  const envelope = { message: messageStr, signature: signatureBase58 };

  const r = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ envelope }),
  });
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || "register failed");
  return j.state as { amount: string; lastAction: "stake" | "unstake"; updatedAt: string; nonce: number };
}

/** iMessage-styled StakeBox */
export default function StakeBox() {
  const [wallet, setWallet] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("1000000");
  const [state, setState] = useState<any>(null);

  const domain = useMemo(
    () => (process.env.NEXT_PUBLIC_SITE_ORIGIN as string) || window.location.origin,
    []
  );

  async function connect() {
    const provider = (window as any).solana;
    if (!provider) { alert("Open with Phantom or Backpack"); return; }
    const res = await provider.connect();
    const addr = res?.publicKey?.toString?.() || provider.publicKey?.toString?.();
    if (addr) { setWallet(addr); setConnected(true); }
  }

  async function doAction(action: "stake" | "unstake") {
    if (!wallet) return;
    setLoading(true);
    try {
      const nonce = await getNonce(wallet);
      const amount = action === "stake" ? (stakeAmount || "0") : "0";
      const newState = await signAndSend({ wallet, action, amount, domain, nonce });
      setState(newState);
    } catch (e: any) {
      alert(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const provider = (window as any).solana;
    if (provider?.isPhantom || provider?.isBackpack) {
      provider.connect({ onlyIfTrusted: true }).then((r: any) => {
        const addr = r?.publicKey?.toString?.() || provider.publicKey?.toString?.();
        if (addr) { setWallet(addr); setConnected(true); }
      }).catch(() => {});
    }
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute -inset-2 rounded-3xl blur-2xl opacity-40"
           style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(56,189,248,0.25), rgba(124,58,237,0.12), transparent 70%)" }} />

      {/* Outer card (transparent, glassy) */}
      <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* little blue dot/avatar bubble */}
            <div className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
            <h3 className="text-sm font-semibold tracking-wide text-white/90">Stake</h3>
          </div>

          {!connected ? (
            <button
              onClick={connect}
              className="btn-neon rounded-xl px-3 py-1.5 text-sm"
              onMouseMove={(e) => {
                const t = e.currentTarget as HTMLButtonElement;
                const r = t.getBoundingClientRect();
                t.style.setProperty("--x", `${e.clientX - r.left}px`);
                t.style.setProperty("--y", `${e.clientY - r.top}px`);
              }}
            >
              Connect
            </button>
          ) : (
            <span className="text-[11px] text-white/60 max-w-[12rem] truncate">{wallet}</span>
          )}
        </div>

        {/* iMessage bubble container */}
        <div className="space-y-3">
          {/* Blue message bubble with input inside */}
          <div
            className="relative max-w-full rounded-2xl px-4 py-3 text-[15px] leading-tight text-white shadow-lg
                       border border-sky-300/20"
            style={{
              background:
                "linear-gradient(180deg, rgba(56,189,248,0.28), rgba(99,102,241,0.22))",
              boxShadow:
                "0 8px 24px rgba(56,189,248,0.18), inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            <label className="block text-xs uppercase tracking-wide text-white/75 mb-1">
              Amount (tokens)
            </label>
            <div className="flex items-center gap-2">
              <input
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="1,000,000"
                inputMode="numeric"
                className="flex-1 bg-white/10 placeholder-white/60 text-white px-3 py-2 rounded-xl outline-none
                           border border-white/15 focus:border-white/30 focus:ring-2 focus:ring-sky-400/30"
              />
              <button
                type="button"
                onClick={() => setStakeAmount("1000000")}
                className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/15 hover:bg-white/15"
              >
                1M
              </button>
            </div>

            {/* Tail (iMessage style) */}
            <span
              className="absolute -left-1 bottom-2 h-3 w-3 rounded-bl-xl"
              style={{
                background:
                  "radial-gradient(14px 14px at 100% 0%, rgba(56,189,248,0.26) 70%, transparent 71%)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            />
          </div>

          {/* Action buttons row */}
          <div className="flex gap-2">
            <button
              disabled={!connected || loading}
              onClick={() => doAction("stake")}
              className="flex-1 rounded-xl px-4 py-2 font-medium text-black disabled:opacity-50
                         bg-gradient-to-r from-sky-400 to-indigo-400 hover:from-sky-300 hover:to-indigo-300
                         shadow-[0_8px_24px_rgba(56,189,248,0.35)]"
            >
              {loading ? "Signing…" : "Stake"}
            </button>

            <button
              disabled={!connected || loading}
              onClick={() => doAction("unstake")}
              className="flex-1 rounded-xl px-4 py-2 font-medium text-white disabled:opacity-50
                         bg-white/10 border border-white/15 hover:bg-white/15"
            >
              Unstake
            </button>
          </div>

          {/* Readout bubble (subtle) */}
          {state && (
            <div
              className="mt-2 rounded-2xl px-4 py-3 text-xs text-white/80 border border-white/10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(2,6,23,0.4), rgba(2,6,23,0.25))",
              }}
            >
              <div className="opacity-70 mb-1">Current state</div>
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          )}

          <p className="text-[11px] text-white/60">
            Weekly Snapshots Random  Mondays - Friday @ 6:00 PM CT. Eligibility requires&nbsp;
            <span className="font-semibold text-white"> 100,000</span> tokens.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Minimal CSS helpers used:
 * - Uses Tailwind classes already in your project.
 * - Relies on .btn-neon class if you kept it; falls back to gradient background here.
 */
