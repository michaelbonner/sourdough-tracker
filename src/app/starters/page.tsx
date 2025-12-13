import { createStarter } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { startersTable } from "@/db/schema";
import db from "@/index";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StartersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const starters = await db
    .select()
    .from(startersTable)
    .where(eq(startersTable.userId, session.user.id));

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Starters</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        {starters.map((starter) => (
          <Link
            key={starter.id}
            href={`/starters/${starter.id}`}
            className="block p-6 bg-white rounded-lg border border-zinc-200 hover:border-zinc-400 transition-colors shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">{starter.name}</h2>
            <p className="text-zinc-500 text-sm">
              Created: {new Date(starter.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
        {starters.length === 0 && (
          <p className="text-zinc-500 col-span-full">
            No starters found. Create one below!
          </p>
        )}
      </div>

      <div className="max-w-md p-6 bg-zinc-50 rounded-lg border border-zinc-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Add New Starter</h2>
        <form action={createStarter} className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Starter Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Doughy"
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any notes about this starter..."
              rows={3}
            />
          </div>
          <Button type="submit">Create Starter</Button>
        </form>
      </div>
    </div>
  );
}
