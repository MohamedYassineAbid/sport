# match-service/app/schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class MatchBase(BaseModel):
    match_date: date
    competition_id: int
    home_team_id: int
    away_team_id: int

class MatchRead(MatchBase):
    match_id: int
    home_score: Optional[int]
    away_score: Optional[int]
    is_played: bool

    class Config:
        orm_mode = True

class MatchStats(BaseModel):
    match_id: int
    team_id: int
    possession_pct: Optional[int]
    shots_total: Optional[int]
