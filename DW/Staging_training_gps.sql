CREATE TABLE stg_training_gps (
    player_name NVARCHAR(255),
    team_name NVARCHAR(255),
    report_type NVARCHAR(50),
    type_session NVARCHAR(50),
    session_date DATE,
    accel_decel_efforts FLOAT,
    max_acceleration FLOAT,
    max_deceleration FLOAT,
    total_distance FLOAT,
    total_duration FLOAT,
    total_player_load FLOAT,
    sprint_distance FLOAT,
    explosive_efforts FLOAT,
    avg_heart_rate FLOAT,
    max_heart_rate FLOAT
);
GO


