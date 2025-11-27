import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const startersTable = pgTable("starters", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
