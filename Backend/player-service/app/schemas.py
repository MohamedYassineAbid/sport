# player-service/app/schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class PlayerBase(BaseModel):
    player_name_std: str
    position: Optional[str]

class PlayerCreate(PlayerBase):
    player_name_gps: Optional[str]
    player_name_wyscout: Optional[str]

class PlayerRead(PlayerBase):
    player_id: int
    birth_date: Optional[date]
    height_cm: Optional[int]
    weight_kg: Optional[int]
    has_gps: Optional[bool]
    has_wyscout: Optional[bool]
    image_url: Optional[str]

    class Config:
        orm_mode = True

class MatchStat(BaseModel):
    match_id: int
    minutes_played: Optional[int]
    goals: Optional[int]
    assists: Optional[int]
    xg: Optional[float]

    class Config:
        orm_mode = True
