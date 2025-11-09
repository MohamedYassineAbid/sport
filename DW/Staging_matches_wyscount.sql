CREATE TABLE stg_matches (
    team_name NVARCHAR(255),
    date DATE,
    match NVARCHAR(255),
    score NVARCHAR(20),
    competition NVARCHAR(255),
    equipe NVARCHAR(255),
    adversaire NVARCHAR(255),
    attack_attaques_positionnelles FLOAT,
    attack_contre_attaques FLOAT,
    attack_corners FLOAT,
    attack_coups_francs FLOAT,
    attack_penaltys FLOAT,
    attack_tirs FLOAT,
    attack_tirs_cadres FLOAT,
    attack_xg FLOAT,
    defense_buts_concedes FLOAT,
    defense_duels_defensifs_gagnes FLOAT,
    defense_duels_defensifs_pct FLOAT,
    defense_interceptions_total FLOAT,
    defense_cartons_jaunes FLOAT,
    defense_cartons_rouges FLOAT,
    general_passes_precises FLOAT,
    general_passes_precises_pct FLOAT,
    general_passes_total FLOAT,
    general_duels_gagnes FLOAT,
    general_duels_pct FLOAT,
    general_tirs_cadres FLOAT,
    general_xg FLOAT,
    general_possession_pct FLOAT,
    indice_ppda FLOAT,
    indice_rythme_match FLOAT,
    pass_but_coup_franc FLOAT
);
GO



