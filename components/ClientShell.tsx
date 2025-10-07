"use client";

import dynamic from "next/dynamic";

// Load the real page UI only in the browser
const NoSSRPage = dynamic(() => import("./PageClient"), { ssr: false });

export default function ClientShell() {
  return <NoSSRPage />;
}
