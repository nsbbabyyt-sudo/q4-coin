"use client";
import dynamic from "next/dynamic";

// Load the actual UI only in the browser (avoids "window is not defined")
const NoSSRPage = dynamic(() => import("./PageClient"), { ssr: false });

export default function ClientShell() {
  return <NoSSRPage />;
}
