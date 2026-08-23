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

const migrations = [];

for (const entry of journal.entries) {
  if (typeof entry.tag !== "string" || typeof entry.when !== "number") {
    throw new Error("The Drizzle migration journal contains an invalid entry.");
  }

  const sql = await readFile(new URL(`${entry.tag}.sql`, migrationsFolder), "utf8");
  migrations.push({
    hash: createHash("sha256").update(sql).digest("hex"),
    sql,
    tag: entry.tag,
    when: entry.when,
  });
}

if (migrations.length === 0) {
  throw new Error("The Drizzle migration journal is empty.");
}

const client = new pg.Client({ connectionString: databaseUrl });

try {
  console.info(JSON.stringify({ event: "database_migrations_started" }));
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
  let lastMigration = Number(result.rows[0]?.created_at ?? 0);

  if (lastMigration === 0) {
    const initialTables = [
      "account",
      "session",
      "starter_logs",
      "starters",
      "user",
      "verification",
    ];
    const existingTablesResult = await client.query(
      `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = ANY($1::text[])
      `,
      [initialTables],
    );
    const existingTables = new Set(
      existingTablesResult.rows.map((row) => row.table_name),
    );

    if (existingTables.size > 0) {
      const missingTables = initialTables.filter((table) => !existingTables.has(table));

      if (missingTables.length > 0) {
        throw new Error(
          `Cannot baseline the initial migration because these tables are missing: ${missingTables.join(", ")}`,
        );
      }

      const initialMigration = migrations[0];
      await client.query(
        'INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at) VALUES ($1, $2)',
        [initialMigration.hash, initialMigration.when],
      );
      lastMigration = initialMigration.when;
      console.info(
        JSON.stringify({
          event: "database_migration_baselined",
          migration: initialMigration.tag,
        }),
      );
    }
  }

  for (const migration of migrations) {
    if (migration.when <= lastMigration) continue;

    for (const statement of migration.sql.split("--> statement-breakpoint")) {
      if (statement.trim()) await client.query(statement);
    }

    await client.query(
      'INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at) VALUES ($1, $2)',
      [migration.hash, migration.when],
    );
    console.info(
      JSON.stringify({
        event: "database_migration_applied",
        migration: migration.tag,
      }),
    );
  }

  await client.query("COMMIT");
  console.info(JSON.stringify({ event: "database_migrations_complete" }));
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  throw error;
} finally {
  await client.end().catch(() => undefined);
}
