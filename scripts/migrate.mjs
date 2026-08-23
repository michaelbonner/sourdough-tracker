import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to apply database migrations.");
}

const migrationsFolder = new URL("../drizzle/", import.meta.url);
const journal = JSON.parse(
  await readFile(new URL("meta/_journal.json", migrationsFolder), "utf8"),
);

if (!journal || !Array.isArray(journal.entries)) {
  throw new Error("The Drizzle migration journal is invalid.");
}

const client = new pg.Client({ connectionString: databaseUrl });

try {
  await client.connect();
  await client.query("BEGIN");
  await client.query(
    "SELECT pg_advisory_xact_lock(hashtext('sourdough-tracker:migrations'))",
  );
  await client.query('CREATE SCHEMA IF NOT EXISTS "drizzle"');
  await client.query(`
    CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);

  const result = await client.query(
    'SELECT created_at FROM "drizzle"."__drizzle_migrations" ORDER BY created_at DESC LIMIT 1',
  );
  const lastMigration = Number(result.rows[0]?.created_at ?? 0);

  for (const entry of journal.entries) {
    if (typeof entry.tag !== "string" || typeof entry.when !== "number") {
      throw new Error("The Drizzle migration journal contains an invalid entry.");
    }

    if (entry.when <= lastMigration) continue;

    const sql = await readFile(new URL(`${entry.tag}.sql`, migrationsFolder), "utf8");

    for (const statement of sql.split("--> statement-breakpoint")) {
      if (statement.trim()) await client.query(statement);
    }

    const hash = createHash("sha256").update(sql).digest("hex");
    await client.query(
      'INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at) VALUES ($1, $2)',
      [hash, entry.when],
    );
  }

  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  throw error;
} finally {
  await client.end().catch(() => undefined);
}
