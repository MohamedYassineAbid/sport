-- Sports Analytics Database Schema

-- Users table (synced from Keycloak)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    keycloak_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    roles JSONB,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leagues table
CREATE TABLE IF NOT EXISTS leagues (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    season VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Positions table
CREATE TABLE IF NOT EXISTS positions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    short_name VARCHAR(10) NOT NULL,
    category VARCHAR(10) CHECK (category IN ('GK', 'DEF', 'MID', 'FWD')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(50),
    logo_url TEXT,
    league_id VARCHAR(50) REFERENCES leagues(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    team_id VARCHAR(50) REFERENCES teams(id),
    position_id VARCHAR(50) REFERENCES positions(id),
    date_of_birth DATE,
    nationality VARCHAR(50),
    jersey_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(50) PRIMARY KEY,
    league_id VARCHAR(50) REFERENCES leagues(id),
    home_team_id VARCHAR(50) REFERENCES teams(id),
    away_team_id VARCHAR(50) REFERENCES teams(id),
    home_score INT DEFAULT 0,
    away_score INT DEFAULT 0,
    match_date TIMESTAMP NOT NULL,
    season VARCHAR(20),
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match analytics table
CREATE TABLE IF NOT EXISTS match_analytics (
    id SERIAL PRIMARY KEY,
    match_id VARCHAR(50) REFERENCES matches(id) ON DELETE CASCADE,
    possession_home DECIMAL(5,2),
    possession_away DECIMAL(5,2),
    shots_home INT,
    shots_away INT,
    shots_on_target_home INT,
    shots_on_target_away INT,
    passes_home INT,
    passes_away INT,
    pass_accuracy_home DECIMAL(5,2),
    pass_accuracy_away DECIMAL(5,2),
    corners_home INT,
    corners_away INT,
    fouls_home INT,
    fouls_away INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(match_id)
);

-- Player match statistics table
CREATE TABLE IF NOT EXISTS player_match_stats (
    id SERIAL PRIMARY KEY,
    player_id VARCHAR(50) REFERENCES players(id),
    match_id VARCHAR(50) REFERENCES matches(id),
    minutes_played INT DEFAULT 0,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    shots INT DEFAULT 0,
    shots_on_target INT DEFAULT 0,
    passes INT DEFAULT 0,
    pass_accuracy DECIMAL(5,2),
    tackles INT DEFAULT 0,
    interceptions INT DEFAULT 0,
    fouls_committed INT DEFAULT 0,
    fouls_drawn INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, match_id)
);

-- Insert sample positions
INSERT INTO positions (id, name, short_name, category) VALUES
    ('pos_gk', 'Goalkeeper', 'GK', 'GK'),
    ('pos_cb', 'Center Back', 'CB', 'DEF'),
    ('pos_lb', 'Left Back', 'LB', 'DEF'),
    ('pos_rb', 'Right Back', 'RB', 'DEF'),
    ('pos_cdm', 'Defensive Midfielder', 'CDM', 'MID'),
    ('pos_cm', 'Central Midfielder', 'CM', 'MID'),
    ('pos_cam', 'Attacking Midfielder', 'CAM', 'MID'),
    ('pos_lw', 'Left Winger', 'LW', 'FWD'),
    ('pos_rw', 'Right Winger', 'RW', 'FWD'),
    ('pos_st', 'Striker', 'ST', 'FWD'),
    ('pos_cf', 'Center Forward', 'CF', 'FWD')
ON CONFLICT (id) DO NOTHING;

-- Insert sample leagues
INSERT INTO leagues (id, name, country, season) VALUES
    ('premier_league', 'Premier League', 'England', '2024-25'),
    ('la_liga', 'La Liga', 'Spain', '2024-25'),
    ('bundesliga', 'Bundesliga', 'Germany', '2024-25'),
    ('serie_a', 'Serie A', 'Italy', '2024-25'),
    ('ligue_1', 'Ligue 1', 'France', '2024-25')
ON CONFLICT (id) DO NOTHING;

-- Insert sample teams
INSERT INTO teams (id, name, short_name, league_id) VALUES
    ('man_utd', 'Manchester United', 'MUN', 'premier_league'),
    ('liverpool', 'Liverpool', 'LIV', 'premier_league'),
    ('man_city', 'Manchester City', 'MCI', 'premier_league'),
    ('chelsea', 'Chelsea', 'CHE', 'premier_league'),
    ('arsenal', 'Arsenal', 'ARS', 'premier_league'),
    ('real_madrid', 'Real Madrid', 'RMA', 'la_liga'),
    ('barcelona', 'Barcelona', 'BAR', 'la_liga'),
    ('bayern', 'Bayern Munich', 'BAY', 'bundesliga'),
    ('juventus', 'Juventus', 'JUV', 'serie_a'),
    ('psg', 'Paris Saint-Germain', 'PSG', 'ligue_1')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_league ON matches(league_id);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_player_match_stats_player ON player_match_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_match_stats_match ON player_match_stats(match_id);
CREATE INDEX IF NOT EXISTS idx_users_keycloak ON users(keycloak_id);

-- Grant permissions (if needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

COMMIT;
