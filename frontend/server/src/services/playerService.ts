import { getDatabase } from "../config/database.js";
import {
  CacheTTL,
  CacheKeys,
  getCacheOrFetch,
} from "../utils/cache.js";

/**
 * Player Service with Redis caching
 */

export interface PlayerStats {
  playerId: string;
  playerName: string;
  position: string;
  team: string;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  passAccuracy: number;
  shotsPerGame: number;
  tacklesPerGame: number;
  season?: string;
}

/**
 * Get player statistics with caching
 */
export async function getPlayerStats(
  playerId: string,
  season?: string
): Promise<PlayerStats | null> {
  const cacheKey = CacheKeys.playerStats(playerId, season);

  return await getCacheOrFetch<PlayerStats | null>(
    cacheKey,
    async () => {
      const db = getDatabase();
      
      let query = `
        SELECT 
          p.id as player_id,
          p.name as player_name,
          pos.name as position,
          t.name as team,
          COUNT(DISTINCT pm.match_id) as matches,
          SUM(pm.goals) as goals,
          SUM(pm.assists) as assists,
          SUM(pm.yellow_cards) as yellow_cards,
          SUM(pm.red_cards) as red_cards,
          SUM(pm.minutes_played) as minutes_played,
          AVG(pm.pass_accuracy) as pass_accuracy,
          AVG(pm.shots) as shots_per_game,
          AVG(pm.tackles) as tackles_per_game
        FROM players p
        JOIN teams t ON p.team_id = t.id
        JOIN positions pos ON p.position_id = pos.id
        LEFT JOIN player_match_stats pm ON p.id = pm.player_id
      `;

      const params: any[] = [playerId];

      if (season) {
        query += ` JOIN matches m ON pm.match_id = m.id WHERE p.id = $1 AND m.season = $2`;
        params.push(season);
      } else {
        query += ` WHERE p.id = $1`;
      }

      query += ` GROUP BY p.id, p.name, pos.name, t.name`;

      const result = await db.query(query, params);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        playerId: row.player_id,
        playerName: row.player_name,
        position: row.position,
        team: row.team,
        matches: parseInt(row.matches) || 0,
        goals: parseInt(row.goals) || 0,
        assists: parseInt(row.assists) || 0,
        yellowCards: parseInt(row.yellow_cards) || 0,
        redCards: parseInt(row.red_cards) || 0,
        minutesPlayed: parseInt(row.minutes_played) || 0,
        passAccuracy: parseFloat(row.pass_accuracy) || 0,
        shotsPerGame: parseFloat(row.shots_per_game) || 0,
        tacklesPerGame: parseFloat(row.tackles_per_game) || 0,
        season,
      };
    },
    CacheTTL.LONG // Cache for 1 hour
  );
}

/**
 * Get top scorers with caching
 */
export async function getTopScorers(
  leagueId?: string,
  limit: number = 10
): Promise<any[]> {
  const cacheKey = `top_scorers:${leagueId || "all"}:${limit}`;

  return await getCacheOrFetch(
    cacheKey,
    async () => {
      const db = getDatabase();
      
      let query = `
        SELECT 
          p.id,
          p.name,
          t.name as team,
          pos.name as position,
          SUM(pm.goals) as total_goals,
          COUNT(DISTINCT pm.match_id) as matches
        FROM players p
        JOIN teams t ON p.team_id = t.id
        JOIN positions pos ON p.position_id = pos.id
        JOIN player_match_stats pm ON p.id = pm.player_id
      `;

      const params: any[] = [];

      if (leagueId) {
        query += ` WHERE t.league_id = $1`;
        params.push(leagueId);
      }

      query += `
        GROUP BY p.id, p.name, t.name, pos.name
        ORDER BY total_goals DESC
        LIMIT $${params.length + 1}
      `;
      params.push(limit);

      const result = await db.query(query, params);
      return result.rows;
    },
    CacheTTL.MEDIUM // Cache for 30 minutes
  );
}
