"use server";

import { startersTable } from "@/db/schema";
import db from "@/index";
import { auth } from "@/lib/auth";
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

  if (!name) {
    throw new Error("Name is required");
  }

  await db.insert(startersTable).values({
    name,
    userId: session.user.id,
  });

  revalidatePath("/starters");
}
