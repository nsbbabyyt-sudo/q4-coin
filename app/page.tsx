import dynamic from "next/dynamic";

// Tell Next.js not to statically prerender this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Load the client-only home UI on the browser (no server render)
const HomeClient = dynamic(() => import("../components/HomeClient"), { ssr: false });

export default function Page() {
  return <HomeClient />;
}