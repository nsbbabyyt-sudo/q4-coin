"use client";
import { useRef } from "react";

/** Renders /public/logo.jpg with interactive border glow. */
export default function LogoBubble({
  variant = "hero",
  width,
}: {
  variant?: "hero" | "header";
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--glow-o", `1`);
    el.setAttribute("data-glow", "1");
  };
  const handleLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.setProperty("--glow-o", `0`);
    el.removeAttribute("data-glow");
  };

  if (variant === "header") {
    const w = width ?? 300;
    return (
      <div
        ref={ref}
        className="glow-spot"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ width: w, height: Math.round(w * 0.36), borderRadius: 14 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg" alt="q4 iMessage bubble"
          style={{
            width: "180%", height: "auto", objectFit: "cover",
            objectPosition: "100% 74%", transform: "translateX(-12%) translateY(-8%)", display: "block",
          }}
        />
      </div>
    );
  }

  // HERO (BIG + CENTERED)
  return (
    <div
      ref={ref}
      className="glow-spot"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        width: "min(96vw, 900px)",
        aspectRatio: "8.5 / 2.5",
        borderRadius: 18,
        margin: "18px auto 6px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.jpg" alt="q4 iMessage bubble"
        style={{
          width: "200%", height: "auto", objectFit: "cover",
          objectPosition: "100% 82%", transform: "translateX(-0%) translateY(-5%)", display: "block",
        }}
      />
    </div>
  );
}
