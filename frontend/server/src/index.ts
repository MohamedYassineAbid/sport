import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { initDatabase, closeDatabase } from "./config/database.js";
import { initRedis, closeRedis } from "./config/redis.js";
import { inMemoryCache } from "./utils/inMemoryCache.js";
import matchesRouter from "./routes/matches.js";
import playersRouter from "./routes/players.js";
import teamsRouter from "./routes/teams.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:8081",
  credentials: true,
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    redis: "connected",
    database: "connected",
  });
});

// API Routes
app.use("/api/matches", matchesRouter);
app.use("/api/players", playersRouter);
app.use("/api/teams", teamsRouter);

// Example: User sync endpoint
app.post("/api/users/sync", async (req, res) => {
  try {
    const userData = req.body;
    const db = await initDatabase();

    // Insert or update user in PostgreSQL
    const result = await db.query(
      `
      INSERT INTO users (keycloak_id, username, email, first_name, last_name, roles, last_login)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (keycloak_id)
      DO UPDATE SET
        username = $2,
        email = $3,
        first_name = $4,
        last_name = $5,
        roles = $6,
        last_login = NOW(),
        updated_at = NOW()
      RETURNING *
    `,
      [
        userData.keycloak_id,
        userData.username,
        userData.email,
        userData.first_name || null,
        userData.last_name || null,
        JSON.stringify(userData.roles || []),
      ]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

// Example: Cache stats endpoint
app.get("/api/cache/stats", async (req, res) => {
  try {
    const inMemStats = inMemoryCache.getStats();

    res.json({
      success: true,
      data: {
        inMemory: inMemStats,
        redis: {
          connected: true,
        },
      },
    });
  } catch (error) {
    console.error("Error getting cache stats:", error);
    res.status(500).json({ error: "Failed to get cache stats" });
  }
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Initialize and start server
async function startServer() {
  try {
    console.log("🚀 Starting server...");

    // Initialize database
    const db = initDatabase();
    console.log("✅ Database initialized");

    // Initialize Redis
    await initRedis();
    console.log("✅ Redis initialized");

    // Initialize in-memory cache
    await inMemoryCache.initialize(db);
    console.log("✅ In-memory cache initialized");

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
      console.log(`✅ API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received. Closing connections...");
  await closeDatabase();
  await closeRedis();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received. Closing connections...");
  await closeDatabase();
  await closeRedis();
  process.exit(0);
});

// Start the server
startServer();
