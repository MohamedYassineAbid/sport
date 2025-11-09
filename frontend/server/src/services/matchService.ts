import { getDatabase } from "../config/database.js";
import {
  getCache,
  setCache,
  CacheTTL,
  CacheKeys,
  getCacheOrFetch,
} from "../utils/cache.js";

/**
 * Match Analytics Service with Redis caching
 */

export interface MatchAnalytics {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  possession: {
    home: number;
    away: number;
  };
  shots: {
    home: number;
    away: number;
  };
  shotsOnTarget: {
    home: number;
    away: number;
  };
  passes: {
    home: number;
    away: number;
  };
  passAccuracy: {
    home: number;
    away: number;
  };
  corners: {
    home: number;
    away: number;
  };
  fouls: {
    home: number;
    away: number;
  };
  date: string;
}

/**
 * Get match analytics with Redis caching
 * Checks Redis first, then database if not cached
 */
export async function getMatchAnalytics(
  matchId: string
): Promise<MatchAnalytics | null> {
  const cacheKey = CacheKeys.matchAnalytics(matchId);

  return await getCacheOrFetch<MatchAnalytics | null>(
    cacheKey,
    async () => {
      const db = getDatabase();
      const result = await db.query(
        `
        SELECT 
          m.id as match_id,
          ht.name as home_team,
          at.name as away_team,
          m.home_score,
          m.away_score,
          ma.possession_home,
          ma.possession_away,
          ma.shots_home,
          ma.shots_away,
          ma.shots_on_target_home,
          ma.shots_on_target_away,
          ma.passes_home,
          ma.passes_away,
          ma.pass_accuracy_home,
          ma.pass_accuracy_away,
          ma.corners_home,
          ma.corners_away,
          ma.fouls_home,
          ma.fouls_away,
          m.match_date
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        LEFT JOIN match_analytics ma ON m.id = ma.match_id
        WHERE m.id = $1
      `,
        [matchId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        matchId: row.match_id,
        homeTeam: row.home_team,
        awayTeam: row.away_team,
        homeScore: row.home_score,
        awayScore: row.away_score,
        possession: {
          home: row.possession_home || 0,
          away: row.possession_away || 0,
        },
        shots: {
          home: row.shots_home || 0,
          away: row.shots_away || 0,
        },
        shotsOnTarget: {
          home: row.shots_on_target_home || 0,
          away: row.shots_on_target_away || 0,
        },
        passes: {
          home: row.passes_home || 0,
          away: row.passes_away || 0,
        },
        passAccuracy: {
          home: row.pass_accuracy_home || 0,
          away: row.pass_accuracy_away || 0,
        },
        corners: {
          home: row.corners_home || 0,
          away: row.corners_away || 0,
        },
        fouls: {
          home: row.fouls_home || 0,
          away: row.fouls_away || 0,
        },
        date: row.match_date,
      };
    },
    CacheTTL.MEDIUM // Cache for 30 minutes
  );
}

/**
 * Get recent matches with caching
 */
export async function getRecentMatches(limit: number = 10): Promise<any[]> {
  const cacheKey = CacheKeys.recentMatches(limit);

  return await getCacheOrFetch(
    cacheKey,
    async () => {
      const db = getDatabase();
      const result = await db.query(
        `
        SELECT 
          m.id,
          ht.name as home_team,
          at.name as away_team,
          m.home_score,
          m.away_score,
          m.match_date,
          l.name as league_name
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN leagues l ON m.league_id = l.id
        ORDER BY m.match_date DESC
        LIMIT $1
      `,
        [limit]
      );

      return result.rows;
    },
    CacheTTL.SHORT // Cache for 5 minutes
  );
}
