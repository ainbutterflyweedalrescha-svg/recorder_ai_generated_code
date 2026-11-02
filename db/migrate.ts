import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations(): Promise<void> {
  const connectionString =
    process.env.DATABASE_URL ?? 'postgres://localhost:5432/registerflow';
  const pool = new Pool({ connectionString });

  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    const entries = await fs.readdir(migrationsDir);
    const sqlFiles = entries.filter((file) => file.endsWith('.sql')).sort();

    for (const file of sqlFiles) {
      const sqlPath = path.join(migrationsDir, file);
      const sql = await fs.readFile(sqlPath, 'utf8');
      await pool.query(sql);
    }
  } finally {
    await pool.end();
  }
}

runMigrations().catch((err: unknown) => {
  process.stderr.write(`Migration failed: ${String(err)}\n`);
  process.exit(1);
});
