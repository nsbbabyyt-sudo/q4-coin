"use client";
import "./globals.css";
import VersionStamp from "../components/VersionStamp";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <VersionStamp />
      </body>
    </html>
  );
}