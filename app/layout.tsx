@"
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        // Hard fallback styles so the page never appears white in prod
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #000000, #18181b)",
          color: "#ffffff",
          margin: 0,
        }}
        className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white"
      >
        {children}
      </body>
    </html>
  );
}
"@ | Set-Content .\app\layout.tsx -Encoding utf8
