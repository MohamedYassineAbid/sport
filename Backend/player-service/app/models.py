# player-service/app/models.py
from sqlalchemy import Column, Integer, String, Date, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from .db import Base

class DimPlayer(Base):
    __tablename__ = "dim_player"

    player_id = Column(Integer, primary_key=True, index=True)
    player_name_std = Column(String(200), nullable=False)
    player_name_gps = Column(String(200))
    player_name_wyscout = Column(String(200))
    position = Column(String(50))
    birth_date = Column(Date)
    height_cm = Column(Integer)
    weight_kg = Column(Integer)
    has_gps = Column(Boolean, default=False)
    has_wyscout = Column(Boolean, default=False)
    image_url = Column(String(512))

    # relationships (example)
    matches = relationship("FactPlayerWyscout", back_populates="player")

class FactPlayerWyscout(Base):
    __tablename__ = "fact_player_wyscout"

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("dim_player.player_id"), nullable=False, index=True)
    match_id = Column(Integer, index=True)
    minutes_played = Column(Integer)
    goals = Column(Integer, default=0)
    assists = Column(Integer, default=0)
    xg = Column(Float)
    passes_total = Column(Integer)
    passes_precise = Column(Integer)
    # more metrics...

    player = relationship("DimPlayer", back_populates="matches")
