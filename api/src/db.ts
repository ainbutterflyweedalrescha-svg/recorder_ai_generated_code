import pg from 'pg';

const { Pool } = pg;

export interface QueryResultRow {
  [column: string]: unknown;
}

export interface DbClient {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[]
  ): Promise<{ rows: T[]; rowCount: number | null }>;
  release(): void;
}

export interface DbPool {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[]
  ): Promise<{ rows: T[]; rowCount: number | null }>;
  connect(): Promise<DbClient>;
}

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://localhost:5432/registerflow';

export const pool: DbPool = new Pool({ connectionString });
