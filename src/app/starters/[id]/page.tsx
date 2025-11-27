import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { starterLogsTable, startersTable } from "@/db/schema";
import db from "@/index";
import { auth } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { addStarterLog } from "./actions";

export default async function StarterDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const starterId = parseInt(id);
  if (isNaN(starterId)) notFound();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const [starter] = await db
    .select()
    .from(startersTable)
    .where(
      and(
        eq(startersTable.id, starterId),
        eq(startersTable.userId, session.user.id)
      )
    );

  if (!starter) {
    notFound();
  }

  const logs = await db
    .select()
    .from(starterLogsTable)
    .where(eq(starterLogsTable.starterId, starterId))
    .orderBy(desc(starterLogsTable.date));

  const addLogWithId = addStarterLog.bind(null, starterId);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link
          href="/starters"
          className="text-sm text-zinc-500 hover:underline mb-2 block"
        >
          &larr; Back to Starters
        </Link>
        <h1 className="text-3xl font-bold">{starter.name}</h1>
        <p className="text-zinc-500">
          Created: {new Date(starter.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">History</h2>
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-white rounded-lg border border-zinc-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">
                    {log.bakedItem || "Feeding"}
                  </h3>
                  <span className="text-sm text-zinc-500">
                    {new Date(log.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {log.ratio && (
                    <div>
                      <span className="font-medium">Ratio:</span> {log.ratio}
                    </div>
                  )}
                  {log.fermentationTime && (
                    <div>
                      <span className="font-medium">Fermentation:</span>{" "}
                      {log.fermentationTime}
                    </div>
                  )}
                </div>
                {log.notes && (
                  <div className="mt-2 text-sm text-zinc-600 border-t pt-2">
                    {log.notes}
                  </div>
                )}
              </div>
            ))}
            {logs.length === 0 && <p className="text-zinc-500">No logs yet.</p>}
          </div>
        </div>

        <div>
          <div className="p-6 bg-zinc-50 rounded-lg border border-zinc-200 shadow-sm sticky top-10">
            <h2 className="text-xl font-semibold mb-4">Log Feeding / Bake</h2>
            <form action={addLogWithId} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ratio">Ratio (Starter:Flour:Water)</Label>
                <Input
                  type="text"
                  id="ratio"
                  name="ratio"
                  placeholder="e.g. 1:2:2"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bakedItem">What was made?</Label>
                <Input
                  type="text"
                  id="bakedItem"
                  name="bakedItem"
                  placeholder="e.g. Sourdough Loaf, Pancakes"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fermentationTime">Fermentation Time</Label>
                <Input
                  type="text"
                  id="fermentationTime"
                  name="fermentationTime"
                  placeholder="e.g. 12 hours"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Flour type, temp, etc."
                />
              </div>
              <Button type="submit" className="w-full">
                Add Log
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
