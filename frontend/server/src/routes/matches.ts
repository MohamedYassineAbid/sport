import express, { Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { getMatchAnalytics, getRecentMatches } from "../services/matchService.js";
import { invalidateCachePattern } from "../utils/cache.js";

const router = express.Router();

/**
 * GET /api/matches/recent
 * Get recent matches with Redis caching
 */
router.get("/recent", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const matches = await getRecentMatches(limit);

    res.json({
      success: true,
      data: matches,
      cached: true,
      user: req.user?.preferred_username,
    });
  } catch (error) {
    console.error("Error fetching recent matches:", error);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

/**
 * GET /api/matches/:id/analytics
 * Get match analytics with Redis caching
 * Example: First checks Redis, then database if not cached
 */
router.get("/:id/analytics", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const matchId = req.params.id;
    const analytics = await getMatchAnalytics(matchId);

    if (!analytics) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    res.json({
      success: true,
      data: analytics,
      user: req.user?.preferred_username,
    });
  } catch (error) {
    console.error("Error fetching match analytics:", error);
    res.status(500).json({ error: "Failed to fetch match analytics" });
  }
});

/**
 * POST /api/matches/:id/invalidate
 * Invalidate cache for a specific match (admin only)
 */
router.post("/:id/invalidate", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const matchId = req.params.id;
    const deleted = await invalidateCachePattern(`match:${matchId}*`);

    res.json({
      success: true,
      message: `Invalidated ${deleted} cache entries for match ${matchId}`,
    });
  } catch (error) {
    console.error("Error invalidating cache:", error);
    res.status(500).json({ error: "Failed to invalidate cache" });
  }
});

export default router;
