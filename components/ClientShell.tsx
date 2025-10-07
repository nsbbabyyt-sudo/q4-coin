"use client";
import dynamic from "next/dynamic";
const NoSSRPage = dynamic(() => import("./PageClient"), { ssr: false });
export default function ClientShell() { return <NoSSRPage />; }
