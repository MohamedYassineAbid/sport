import express, { Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { getPlayerStats, getTopScorers } from "../services/playerService.js";
import { inMemoryCache } from "../utils/inMemoryCache.js";

const router = express.Router();

/**
 * GET /api/players/:id/stats
 * Get player statistics with Redis caching
 */
router.get("/:id/stats", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const playerId = req.params.id;
    const season = req.query.season as string | undefined;

    const stats = await getPlayerStats(playerId, season);

    if (!stats) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    res.json({
      success: true,
      data: stats,
      user: req.user?.preferred_username,
    });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
});

/**
 * GET /api/players/top-scorers
 * Get top scorers with Redis caching
 */
router.get("/top-scorers", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const leagueId = req.query.leagueId as string | undefined;
    const limit = parseInt(req.query.limit as string) || 10;

    const topScorers = await getTopScorers(leagueId, limit);

    res.json({
      success: true,
      data: topScorers,
      user: req.user?.preferred_username,
    });
  } catch (error) {
    console.error("Error fetching top scorers:", error);
    res.status(500).json({ error: "Failed to fetch top scorers" });
  }
});

export default router;
