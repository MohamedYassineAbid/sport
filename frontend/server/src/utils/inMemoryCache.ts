/**
 * In-memory cache for static data (teams, leagues, positions)
 * Loaded at server startup for fast access
 */

interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  leagueId: string;
}

interface League {
  id: string;
  name: string;
  country: string;
  season: string;
}

interface Position {
  id: string;
  name: string;
  shortName: string;
  category: "GK" | "DEF" | "MID" | "FWD";
}

class InMemoryCache {
  private teams: Map<string, Team> = new Map();
  private leagues: Map<string, League> = new Map();
  private positions: Map<string, Position> = new Map();
  private initialized: boolean = false;

  /**
   * Initialize in-memory cache with data from database
   */
  async initialize(db: any): Promise<void> {
    if (this.initialized) {
      console.log("⚠️  In-memory cache already initialized");
      return;
    }

    try {
      console.log("🔄 Loading static data into memory...");

      // Load teams
      const teamsResult = await db.query("SELECT * FROM teams");
      teamsResult.rows.forEach((team: Team) => {
        this.teams.set(team.id, team);
      });
      console.log(`✅ Loaded ${this.teams.size} teams`);

      // Load leagues
      const leaguesResult = await db.query("SELECT * FROM leagues");
      leaguesResult.rows.forEach((league: League) => {
        this.leagues.set(league.id, league);
      });
      console.log(`✅ Loaded ${this.leagues.size} leagues`);

      // Load positions
      const positionsResult = await db.query("SELECT * FROM positions");
      positionsResult.rows.forEach((position: Position) => {
        this.positions.set(position.id, position);
      });
      console.log(`✅ Loaded ${this.positions.size} positions`);

      this.initialized = true;
      console.log("✅ In-memory cache initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing in-memory cache:", error);
      throw error;
    }
  }

  /**
   * Get team by ID
   */
  getTeam(id: string): Team | undefined {
    return this.teams.get(id);
  }

  /**
   * Get all teams
   */
  getAllTeams(): Team[] {
    return Array.from(this.teams.values());
  }

  /**
   * Get teams by league
   */
  getTeamsByLeague(leagueId: string): Team[] {
    return Array.from(this.teams.values()).filter(
      (team) => team.leagueId === leagueId
    );
  }

  /**
   * Get league by ID
   */
  getLeague(id: string): League | undefined {
    return this.leagues.get(id);
  }

  /**
   * Get all leagues
   */
  getAllLeagues(): League[] {
    return Array.from(this.leagues.values());
  }

  /**
   * Get position by ID
   */
  getPosition(id: string): Position | undefined {
    return this.positions.get(id);
  }

  /**
   * Get all positions
   */
  getAllPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  /**
   * Get positions by category
   */
  getPositionsByCategory(
    category: "GK" | "DEF" | "MID" | "FWD"
  ): Position[] {
    return Array.from(this.positions.values()).filter(
      (pos) => pos.category === category
    );
  }

  /**
   * Refresh a specific team
   */
  async refreshTeam(db: any, teamId: string): Promise<void> {
    const result = await db.query("SELECT * FROM teams WHERE id = $1", [
      teamId,
    ]);
    if (result.rows.length > 0) {
      this.teams.set(teamId, result.rows[0]);
      console.log(`✅ Refreshed team: ${teamId}`);
    }
  }

  /**
   * Refresh all static data
   */
  async refresh(db: any): Promise<void> {
    this.initialized = false;
    this.teams.clear();
    this.leagues.clear();
    this.positions.clear();
    await this.initialize(db);
  }

  /**
   * Check if cache is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      initialized: this.initialized,
      teams: this.teams.size,
      leagues: this.leagues.size,
      positions: this.positions.size,
    };
  }
}

// Singleton instance
export const inMemoryCache = new InMemoryCache();
