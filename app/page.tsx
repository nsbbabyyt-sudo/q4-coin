"use client";

import dynamic from "next/dynamic";

// Load the client-only home UI in the browser (disable SSR)
const HomeClient = dynamic(() => import("../components/HomeClient"), { ssr: false });

export default function Page() {
  return <HomeClient />;
}