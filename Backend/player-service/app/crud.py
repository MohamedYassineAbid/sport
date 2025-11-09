# player-service/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date
from typing import List, Optional

def get_player(db: Session, player_id: int) -> Optional[models.DimPlayer]:
    return db.query(models.DimPlayer).filter(models.DimPlayer.player_id == player_id).first()

def search_players(db: Session, q: Optional[str] = None, limit: int = 25) -> List[models.DimPlayer]:
    query = db.query(models.DimPlayer)
    if q:
        query = query.filter(models.DimPlayer.player_name_std.ilike(f"%{q}%"))
    return query.order_by(models.DimPlayer.player_name_std).limit(limit).all()

def create_player(db: Session, player: schemas.PlayerCreate) -> models.DimPlayer:
    obj = models.DimPlayer(
        player_name_std=player.player_name_std,
        player_name_gps=player.player_name_gps,
        player_name_wyscout=player.player_name_wyscout,
        position=getattr(player, "position", None)
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_player_match_history(db: Session, player_id: int, limit: int = 10):
    return (db.query(models.FactPlayerWyscout)
            .filter(models.FactPlayerWyscout.player_id == player_id)
            .order_by(models.FactPlayerWyscout.id.desc())
            .limit(limit)
            .all())
