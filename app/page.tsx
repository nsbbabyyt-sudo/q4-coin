export const revalidate = 60; // set to false or 0 if you prefer no ISR

import PageClient from "../components/PageClient";

export default function Page() {
  return <PageClient />;
}
