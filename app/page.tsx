import dynamicImport from "next/dynamic";

// Keep these so Next won’t try to prerender
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Load the client-only home UI in the browser (no SSR)
const HomeClient = dynamicImport(() => import("../components/HomeClient"), { ssr: false });

export default function Page() {
  return <HomeClient />;
}