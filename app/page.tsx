export const dynamic = "force-dynamic"; // don’t prerender this route

import dynamicImport from "next/dynamic";

// Load the client page only on the browser (never on the server)
const PageClient = dynamicImport(() => import("../components/PageClient"), {
  ssr: false,
});

export default function Page() {
  return <PageClient />;
}
