# match-service/app/models.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .db import Base

class DimMatch(Base):
    __tablename__ = "dim_match"

    match_id = Column(Integer, primary_key=True, index=True)
    match_date = Column(Date, nullable=False)
    competition_id = Column(Integer, index=True)
    home_team_id = Column(Integer, index=True)
    away_team_id = Column(Integer, index=True)
    home_score = Column(Integer)
    away_score = Column(Integer)
    is_played = Column(Boolean, default=False)

    # relationships could be added for convenience

class FactWyscoutMatch(Base):
    __tablename__ = "fact_wyscout_match"
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("dim_match.match_id"))
    team_id = Column(Integer, index=True)
    possession_pct = Column(Integer)
    shots_total = Column(Integer)
    shots_on_target = Column(Integer)
    xg = Column(Integer)
    # ... many more aggregated metrics
