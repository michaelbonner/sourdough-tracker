import { LoginForm, SignUpForm } from "./components/AuthButtons";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
      <main className="w-full max-w-3xl py-32 px-16 bg-white sm:items-start text-center sm:text-left rounded-xl shadow-sm border border-zinc-100">
        <h1 className="text-4xl font-bold mb-4">Sourdough Tracker</h1>
        <p className="text-lg mb-8 text-zinc-600">
          Track your sourdough bread baking progress
        </p>

        {session ? (
          <Link href="/starters">
            <Button>Go to My Starters</Button>
          </Link>
        ) : (
          <div className="grid gap-4 divide-y divide-slate-200">
            <div className="py-4">
              <LoginForm />
            </div>
            <div className="py-4">
              <SignUpForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
