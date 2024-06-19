import dotenv from "dotenv";
import { Pool } from "pg";
import { createServer } from "prool";
import { anvil } from "prool/instances";

export default async function () {
  dotenv.config({ path: ".env.local" });

  const proolServer = createServer({
    host: "127.0.0.1",
    port: 8545,
    instance: anvil({ chainId: 1 }),
  });

  await proolServer.start();

  let cleanupDatabase: () => Promise<void>;
  if (process.env.DATABASE_URL) {
    cleanupDatabase = async () => {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });

      const databaseRows = await pool.query(`
        SELECT datname FROM pg_database WHERE datname LIKE 'vitest_%';
      `);
      const databases = databaseRows.rows.map((r) => r.datname) as string[];

      await Promise.all(
        databases.map((databaseName) =>
          pool.query(`DROP DATABASE "${databaseName}"`),
        ),
      );

      await pool.end();
    };
  }

  return async () => {
    await proolServer.stop();
    await cleanupDatabase?.();
  };
}
