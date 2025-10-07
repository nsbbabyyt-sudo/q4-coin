import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
        {children}
      </body>
    </html>
  );
}
