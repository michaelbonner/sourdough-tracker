import LandingPage from "./components/LandingPage";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <LandingPage session={session} />;
}
