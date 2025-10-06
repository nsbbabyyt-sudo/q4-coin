"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

function short(addr: string) {
  return addr.length > 10 ? `${addr.slice(0,4)}…${addr.slice(-4)}` : addr;
}

export default function WalletConnect() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const onConnect = () => setVisible(true);
  const onCopy = async () => {
    if (publicKey) await navigator.clipboard.writeText(publicKey.toBase58());
    setOpen(false);
  };
  const onDisconnect = async () => {
    await disconnect();
    setOpen(false);
  };

  if (!connected) {
    return (
      <button className="btn-wallet glow-spot" onClick={onConnect}>
        <span className="dot" />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        className="btn-wallet glow-spot connected"
        onClick={() => setOpen((v) => !v)}
        title={publicKey?.toBase58()}
      >
        <span className="dot online" />
        {short(publicKey!.toBase58())}
        <svg width="14" height="14" viewBox="0 0 24 24" className="chev">
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <div className="wallet-menu" role="menu">
          <button role="menuitem" onClick={onCopy}>Copy address</button>
          <button role="menuitem" onClick={onDisconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
