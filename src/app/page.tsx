import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans px-4">
      <main className="w-full max-w-7xl py-32 px-16 bg-white sm:items-start text-center sm:text-left rounded-xl shadow-sm border border-zinc-100">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <h1 className="text-4xl font-bold mb-4">Sourdough Tracker</h1>
            <p className="text-lg mb-8 text-zinc-600">
              Track your sourdough bread baking progress
            </p>
          </div>

          {session ? (
            <Link href="/starters">
              <Button>Go to My Starters</Button>
            </Link>
          ) : (
            <div>
              <Tabs defaultValue="login" className="w-full">
                <TabsList>
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Signup</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="w-full py-4">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="signup" className="w-full py-4">
                  <SignUpForm />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
