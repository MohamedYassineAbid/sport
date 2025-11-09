import { Pool } from "pg";

let pool: Pool | null = null;

/**
 * Initialize PostgreSQL connection pool
 */
export function initDatabase(): Pool {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "sportsviz",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on("connect", () => {
    console.log("✅ Connected to PostgreSQL");
  });

  pool.on("error", (err) => {
    console.error("❌ PostgreSQL Error:", err);
  });

  return pool;
}

/**
 * Get database pool instance
 */
export function getDatabase(): Pool {
  if (!pool) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return pool;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("❌ PostgreSQL connection closed");
  }
}
