"use server";

import { starterLogsTable, startersTable } from "@/db/schema";
import db from "@/index";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function addStarterLog(starterId: number, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
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
    throw new Error("Starter not found or unauthorized");
  }

  const dateStr = formData.get("date") as string;
  const ratio = formData.get("ratio") as string;
  const bakedItem = formData.get("bakedItem") as string;
  const fermentationTime = formData.get("fermentationTime") as string;
  const notes = formData.get("notes") as string;

  await db.insert(starterLogsTable).values({
    starterId,
    date: dateStr ? new Date(dateStr) : new Date(),
    ratio,
    bakedItem,
    fermentationTime,
    notes,
  });

  revalidatePath(`/starters/${starterId}`);
}

export async function updateStarterLog(logId: number, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Verify ownership via starter
  const [log] = await db
    .select()
    .from(starterLogsTable)
    .innerJoin(startersTable, eq(starterLogsTable.starterId, startersTable.id))
    .where(
      and(
        eq(starterLogsTable.id, logId),
        eq(startersTable.userId, session.user.id)
      )
    );

  if (!log) {
    throw new Error("Log not found or unauthorized");
  }

  const dateStr = formData.get("date") as string;
  const ratio = formData.get("ratio") as string;
  const bakedItem = formData.get("bakedItem") as string;
  const fermentationTime = formData.get("fermentationTime") as string;
  const notes = formData.get("notes") as string;

  await db
    .update(starterLogsTable)
    .set({
      date: dateStr ? new Date(dateStr) : new Date(),
      ratio,
      bakedItem,
      fermentationTime,
      notes,
    })
    .where(eq(starterLogsTable.id, logId));

  revalidatePath(`/starters/${log.starters.id}`);
}

export async function deleteStarterLog(logId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Verify ownership via starter
  const [log] = await db
    .select()
    .from(starterLogsTable)
    .innerJoin(startersTable, eq(starterLogsTable.starterId, startersTable.id))
    .where(
      and(
        eq(starterLogsTable.id, logId),
        eq(startersTable.userId, session.user.id)
      )
    );

  if (!log) {
    throw new Error("Log not found or unauthorized");
  }

  await db.delete(starterLogsTable).where(eq(starterLogsTable.id, logId));

  revalidatePath(`/starters/${log.starters.id}`);
}
