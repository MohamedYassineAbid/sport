# match-service/app/crud.py
from sqlalchemy.orm import Session
from .models import DimMatch, FactWyscoutMatch
from typing import List, Optional

def list_matches(db: Session, competition_id: Optional[int] = None, limit: int = 50):
    q = db.query(DimMatch)
    if competition_id:
        q = q.filter(DimMatch.competition_id == competition_id)
    return q.order_by(DimMatch.match_date.desc()).limit(limit).all()

def get_match(db: Session, match_id: int):
    return db.query(DimMatch).filter(DimMatch.match_id == match_id).first()

def get_match_stats(db: Session, match_id: int):
    return db.query(FactWyscoutMatch).filter(FactWyscoutMatch.match_id == match_id).all()
