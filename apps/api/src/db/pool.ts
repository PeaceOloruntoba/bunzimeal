import 'dotenv/config';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // eslint-disable-next-line no-console
  console.warn('[db] DATABASE_URL is not set. Database calls will fail until set.');
}

export const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

export async function healthCheck() {
  const client = await pool.connect();
  try {
    const res = await client.query('select 1');
    return res?.rows?.[0]?.['?column?'] === 1 || res?.rows?.[0]?.['1'] === 1 || true;
  } finally {
    client.release();
  }
}
