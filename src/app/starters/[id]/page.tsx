import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/index";
import { startersTable, starterLogsTable } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { addStarterLog } from "./actions";
import { renameStarter, deleteStarter } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { StarterLogItem } from "@/components/starter-log-item";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
        eq(startersTable.userId, session.user.id),
      ),
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
  const renameStarterWithId = renameStarter.bind(null, starterId);
  const deleteStarterWithId = deleteStarter.bind(null, starterId);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link
            href="/starters"
            className="text-sm text-zinc-500 hover:underline mb-2 block"
          >
            &larr; Back to Starters
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{starter.name}</h1>
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>

                  <form action={renameStarterWithId} className="flex gap-2">
                    <Input
                      name="name"
                      placeholder="New Name"
                      className="w-40"
                      required
                      defaultValue={starter.name}
                    />
                    <Button type="submit" variant="outline">
                      Rename
                    </Button>
                  </form>
                  <div className="flex justify-end mt-8">
                    <form action={deleteStarterWithId}>
                      <Button type="submit" variant="destructive">
                        Delete
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </form>
            </Dialog>
          </div>
          <p className="text-zinc-500">
            Created: {new Date(starter.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">History</h2>
          <div className="space-y-4">
            {logs.map((log) => (
              <StarterLogItem key={log.id} log={log} />
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
