# match-service/app/main.py
from fastapi import FastAPI, Depends, HTTPException, Query
from . import db, crud, schemas, auth
from typing import List, Optional
import logging

app = FastAPI(title="Match Service", version="0.1")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("match-service")

@app.on_event("startup")
def on_startup():
    from .db import Base, engine
    Base.metadata.create_all(bind=engine)
    logger.info("Match service started and tables created (demo).")

@app.get("/healthz")
def health():
    return {"status": "ok", "service": "match-service"}

@app.get("/matches", response_model=List[schemas.MatchRead])
def matches(competition_id: Optional[int] = Query(None), limit: int = 50,
            token=Depends(auth.verify_token), db_session=Depends(db.get_db)):
    try:
        return crud.list_matches(db_session, competition_id=competition_id, limit=limit)
    except Exception as e:
        logger.exception("Failed to list matches")
        raise HTTPException(status_code=500, detail="Internal error")

@app.get("/matches/{match_id}", response_model=schemas.MatchRead)
def match_detail(match_id: int, token=Depends(auth.verify_token), db_session=Depends(db.get_db)):
    m = crud.get_match(db_session, match_id)
    if not m:
        raise HTTPException(status_code=404, detail="Match not found")
    return m

@app.get("/matches/{match_id}/stats", response_model=List[schemas.MatchStats])
def match_stats(match_id: int, token=Depends(auth.verify_token), db_session=Depends(db.get_db)):
    stats = crud.get_match_stats(db_session, match_id)
    return stats
