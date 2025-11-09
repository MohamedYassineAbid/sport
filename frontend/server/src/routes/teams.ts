import express, { Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { inMemoryCache } from "../utils/inMemoryCache.js";

const router = express.Router();

/**
 * GET /api/teams
 * Get all teams from in-memory cache
 */
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const teams = inMemoryCache.getAllTeams();

    res.json({
      success: true,
      data: teams,
      count: teams.length,
      cached: "in-memory",
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

/**
 * GET /api/teams/:id
 * Get team by ID from in-memory cache
 */
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const teamId = req.params.id;
    const team = inMemoryCache.getTeam(teamId);

    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    res.json({
      success: true,
      data: team,
      cached: "in-memory",
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

/**
 * GET /api/teams/league/:leagueId
 * Get teams by league from in-memory cache
 */
router.get("/league/:leagueId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const leagueId = req.params.leagueId;
    const teams = inMemoryCache.getTeamsByLeague(leagueId);

    res.json({
      success: true,
      data: teams,
      count: teams.length,
      cached: "in-memory",
    });
  } catch (error) {
    console.error("Error fetching teams by league:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

export default router;
