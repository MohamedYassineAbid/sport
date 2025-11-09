import { getRedisClient } from "../config/redis.js";

/**
 * Cache helper functions for Redis Stack
 */

// Default TTL values (in seconds)
export const CacheTTL = {
  SHORT: parseInt(process.env.CACHE_TTL_SHORT || "300"), // 5 minutes
  MEDIUM: parseInt(process.env.CACHE_TTL_MEDIUM || "1800"), // 30 minutes
  LONG: parseInt(process.env.CACHE_TTL_LONG || "3600"), // 1 hour
  STATIC: parseInt(process.env.CACHE_TTL_STATIC || "86400"), // 24 hours
};

/**
 * Get a value from Redis cache
 * @param key - Cache key
 * @returns Cached value or null if not found
 */
export async function getCache<T = any>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    const value = await client.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
}

/**
 * Set a value in Redis cache with TTL
 * @param key - Cache key
 * @param value - Value to cache
 * @param ttlSeconds - Time to live in seconds (default: 1 hour)
 * @returns true if successful, false otherwise
 */
export async function setCache(
  key: string,
  value: any,
  ttlSeconds: number = CacheTTL.LONG
): Promise<boolean> {
  try {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);

    await client.setEx(key, ttlSeconds, serialized);
    return true;
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete a key from Redis cache
 * @param key - Cache key to delete
 * @returns true if deleted, false otherwise
 */
export async function delCache(key: string): Promise<boolean> {
  try {
    const client = getRedisClient();
    const result = await client.del(key);
    return result > 0;
  } catch (error) {
    console.error(`Error deleting cache for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple keys from Redis cache
 * @param keys - Array of cache keys to delete
 * @returns Number of keys deleted
 */
export async function delCacheMultiple(keys: string[]): Promise<number> {
  try {
    const client = getRedisClient();
    return await client.del(keys);
  } catch (error) {
    console.error(`Error deleting multiple cache keys:`, error);
    return 0;
  }
}

/**
 * Check if a key exists in cache
 * @param key - Cache key
 * @returns true if exists, false otherwise
 */
export async function cacheExists(key: string): Promise<boolean> {
  try {
    const client = getRedisClient();
    const result = await client.exists(key);
    return result === 1;
  } catch (error) {
    console.error(`Error checking cache existence for key ${key}:`, error);
    return false;
  }
}

/**
 * Get remaining TTL for a key
 * @param key - Cache key
 * @returns TTL in seconds, -1 if no expiry, -2 if key doesn't exist
 */
export async function getCacheTTL(key: string): Promise<number> {
  try {
    const client = getRedisClient();
    return await client.ttl(key);
  } catch (error) {
    console.error(`Error getting TTL for key ${key}:`, error);
    return -2;
  }
}

/**
 * Get all keys matching a pattern
 * @param pattern - Redis key pattern (e.g., "match:*")
 * @returns Array of matching keys
 */
export async function getCacheKeys(pattern: string): Promise<string[]> {
  try {
    const client = getRedisClient();
    return await client.keys(pattern);
  } catch (error) {
    console.error(`Error getting cache keys for pattern ${pattern}:`, error);
    return [];
  }
}

/**
 * Invalidate all cache keys matching a pattern
 * @param pattern - Redis key pattern (e.g., "match:*")
 * @returns Number of keys deleted
 */
export async function invalidateCachePattern(pattern: string): Promise<number> {
  try {
    const keys = await getCacheKeys(pattern);
    if (keys.length === 0) {
      return 0;
    }
    return await delCacheMultiple(keys);
  } catch (error) {
    console.error(`Error invalidating cache pattern ${pattern}:`, error);
    return 0;
  }
}

/**
 * Cache helper with automatic fallback to database
 * @param key - Cache key
 * @param fetchFn - Function to fetch data if not in cache
 * @param ttlSeconds - TTL in seconds
 * @returns Cached or fresh data
 */
export async function getCacheOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = CacheTTL.LONG
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key);
  if (cached !== null) {
    console.log(`✅ Cache HIT: ${key}`);
    return cached;
  }

  console.log(`❌ Cache MISS: ${key}`);

  // Fetch from database
  const fresh = await fetchFn();

  // Store in cache for next time
  await setCache(key, fresh, ttlSeconds);

  return fresh;
}

/**
 * Generate cache key for consistent naming
 */
export const CacheKeys = {
  match: (matchId: string) => `match:${matchId}`,
  matchAnalytics: (matchId: string) => `match:${matchId}:analytics`,
  player: (playerId: string) => `player:${playerId}`,
  playerStats: (playerId: string, season?: string) =>
    `player:${playerId}:stats${season ? `:${season}` : ""}`,
  team: (teamId: string) => `team:${teamId}`,
  teamStats: (teamId: string, season?: string) =>
    `team:${teamId}:stats${season ? `:${season}` : ""}`,
  league: (leagueId: string) => `league:${leagueId}`,
  user: (userId: string) => `user:${userId}`,
  userPreferences: (userId: string) => `user:${userId}:preferences`,
  recentMatches: (limit: number = 10) => `matches:recent:${limit}`,
  standings: (leagueId: string, season?: string) =>
    `standings:${leagueId}${season ? `:${season}` : ""}`,
};
