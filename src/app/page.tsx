import { getServerAuthSession } from "@/auth";
import { LandingPageShell } from "@/components/landing-page-shell";

export default async function Home() {
  const session = await getServerAuthSession();

  return <LandingPageShell isSignedIn={Boolean(session?.user)} />;
}
