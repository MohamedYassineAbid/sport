CREATE TABLE staging_goalkeepers (
    team_name VARCHAR(100),
    date DATE,
    match VARCHAR(100),
    competition VARCHAR(100),
    player VARCHAR(100),
    periode VARCHAR(50),
    segment VARCHAR(50),

    goalkeeper_but_coup_franc INT,
    goalkeeper_but_coup_franc_courtes INT,
    goalkeeper_but_coup_franc_longues INT,
    goalkeeper_buts_concedes INT,
    goalkeeper_passes_courtes_precises INT,
    goalkeeper_passes_courtes_total INT,
    goalkeeper_passes_longues_precises INT,
    goalkeeper_passes_longues_total INT,
    goalkeeper_place INT,
    goalkeeper_sorties_total INT,
    goalkeeper_tirs_contre_cadres INT,
    goalkeeper_tirs_contre_total INT,
    goalkeeper_xcg FLOAT
);
