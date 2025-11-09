-- dim_date
CREATE TABLE dim_date (
    date_id INT PRIMARY KEY,
    full_date DATE NOT NULL,
    day INT,
    month INT,
    year INT,
    week INT,
    quarter INT,
    day_name VARCHAR(10),
    month_name VARCHAR(20)
);
GO

-- dim_player
CREATE TABLE dim_player (
    player_id INT PRIMARY KEY,
    player_name_std VARCHAR(100),
    player_name_gps VARCHAR(100),
    player_name_wyscout VARCHAR(100),
    has_gps BIT,
    has_wyscout BIT
);
GO

-- dim_team
CREATE TABLE dim_team (
    team_id INT PRIMARY KEY,
    team_name_std VARCHAR(100),
    team_name_gps VARCHAR(100),
    team_name_wyscout VARCHAR(100),
    has_gps BIT,
    has_wyscout BIT
);
GO

--dim_competition
CREATE TABLE dim_competition (
    competition_id INT PRIMARY KEY,
    competition_name VARCHAR(100),
    country VARCHAR(50)
);
GO

--dim_match
CREATE TABLE dim_match (
    match_id INT PRIMARY KEY,
    match_date DATE,
    home_team_id INT,
    away_team_id INT,
    home_score INT NULL,
    away_score INT NULL,
    competition_id INT,
    FOREIGN KEY (home_team_id) REFERENCES dim_team(team_id),
    FOREIGN KEY (away_team_id) REFERENCES dim_team(team_id),
    FOREIGN KEY (competition_id) REFERENCES dim_competition(competition_id)
);

