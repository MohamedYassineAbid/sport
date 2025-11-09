# team-service/app/models.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from .db import Base

class DimTeam(Base):
    __tablename__ = "dim_team"
    team_id = Column(Integer, primary_key=True, index=True)
    team_name_std = Column(String(200), nullable=False)
    team_name_gps = Column(String(200))
    team_name_wyscout = Column(String(200))
    created_at = Column(DateTime)
    image_url = Column(String(512))
    has_gps = Column(Boolean, default=False)
    has_wyscout = Column(Boolean, default=False)

    # roster relationship could be added via foreign key on players
