# team-service/app/schemas.py
from pydantic import BaseModel
from typing import Optional

class TeamBase(BaseModel):
    team_name_std: str

class TeamRead(TeamBase):
    team_id: int
    image_url: Optional[str]
    has_gps: Optional[bool]
    has_wyscout: Optional[bool]

    class Config:
        orm_mode = True
