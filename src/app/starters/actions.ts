"use server";

import { startersTable } from "@/db/schema";
import db from "@/index";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createStarter(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const notes = formData.get("notes") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  await db.insert(startersTable).values({
    name,
    notes: notes || null,
    userId: session.user.id,
  });

  revalidatePath("/starters");
}

export async function renameStarter(starterId: number, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const notes = formData.get("notes") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  await db
    .update(startersTable)
    .set({ name, notes: notes || null })
    .where(
      and(
        eq(startersTable.id, starterId),
        eq(startersTable.userId, session.user.id)
      )
    );

  revalidatePath("/starters");
  revalidatePath(`/starters/${starterId}`);
}

export async function deleteStarter(starterId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(startersTable)
    .where(
      and(
        eq(startersTable.id, starterId),
        eq(startersTable.userId, session.user.id)
      )
    );

  revalidatePath("/starters");
}
