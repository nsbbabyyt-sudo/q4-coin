"use client";

import LogoBubble from "./LogoBubble";
import StakeBox from "./StakeBox";

type Props = {
  /** Desktop: how far down the StakeBox sits inside the bubble (percent of its own height) */
  offsetYPercent?: number; // good range: 16–24
  /** Desktop: nudge the StakeBox horizontally (px). Positive = right, negative = left */
  offsetXPx?: number; // e.g. 40–60 to push right a bit
  /** Max width for the StakeBox */
  maxWidth?: number; // px
  /** Reserved bottom space under the hero (desktop only) so nothing overlaps */
  reservePx?: number; // px
};

export default function HeroWithStake({
  offsetYPercent = 18,
  offsetXPx = 48,
  maxWidth = 720,
  reservePx = 260,
}: Props) {
  return (
    <section className="relative w-full">
      {/* Bubble */}
      <div className="relative z-10">
        {/* No props — zoom is handled inside LogoBubble by default */}
        <LogoBubble />
      </div>

      {/* Desktop/tablet overlay */}
      <div className="pointer-events-none absolute inset-0 hidden md:grid place-items-center px-4 z-20">
        <div
          className="pointer-events-auto w-full"
          style={{
            transform: `translateX(${offsetXPx}px) translateY(${offsetYPercent}%)`,
            maxWidth,
          }}
        >
          <StakeBox />
        </div>
      </div>

      {/* Spacer to reserve room for the overlay on md+ */}
      <div className="hidden md:block" style={{ height: reservePx }} />

      {/* Mobile: StakeBox below the bubble (no overlay) */}
      <div className="md:hidden mt-4 px-4">
        <StakeBox />
      </div>
    </section>
  );
}

