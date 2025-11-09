CREATE TABLE stg_matches_gps (
    player_name NVARCHAR(255),
    team_name NVARCHAR(255),
    type_session NVARCHAR(50),
    gameweek INT,
    opponent NVARCHAR(255),
    match_date DATE,
    total_distance FLOAT,
    total_duration FLOAT,
    total_player_load FLOAT,
    accel_decel_efforts FLOAT,
    max_acceleration FLOAT,
    max_deceleration FLOAT,
    avg_heart_rate FLOAT,
    max_heart_rate FLOAT,
    sprint_distance FLOAT,
    explosive_efforts FLOAT
);

