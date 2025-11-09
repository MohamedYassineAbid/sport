# player-service/app/main.py
from fastapi import FastAPI, Depends, HTTPException, Query
from . import db, crud, schemas, auth
from typing import List, Optional
import logging
from sqlalchemy.exc import SQLAlchemyError

app = FastAPI(title="Player Service", version="0.1")

# configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("player-service")

@app.on_event("startup")
def startup_event():
    # Create tables in demo if needed (in actual deployments migrations are used)
    from .db import Base, engine
    Base.metadata.create_all(bind=engine)
    logger.info("Player Service startup complete.")

@app.get("/healthz")
def health():
    return {"status": "ok", "service": "player-service"}

@app.get("/players", response_model=List[schemas.PlayerRead])
def list_players(q: Optional[str] = Query(None), limit: int = 25,
                 token=Depends(auth.verify_jwt_token), db_session=Depends(db.get_db)):
    """
    Search or list players.
    Auth: token is validated but scope checks are done in business logic if needed.
    """
    try:
        players = crud.search_players(db_session, q=q, limit=limit)
        return players
    except SQLAlchemyError as e:
        logger.exception("DB error listing players")
        raise HTTPException(status_code=500, detail="Database error")

@app.get("/players/{player_id}", response_model=schemas.PlayerRead)
def read_player(player_id: int, token=Depends(auth.verify_jwt_token), db_session=Depends(db.get_db)):
    player = crud.get_player(db_session, player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@app.post("/players", response_model=schemas.PlayerRead)
def post_player(payload: schemas.PlayerCreate, token=Depends(auth.verify_jwt_token), db_session=Depends(db.get_db)):
    # Example role check: only users with 'analyst' or 'coach' role can create
    roles = token.get("realm_access", {}).get("roles", [])
    if "analyst" not in roles and "coach" not in roles:
        raise HTTPException(status_code=403, detail="Insufficient permissions to create player")
    obj = crud.create_player(db_session, payload)
    return obj

@app.get("/players/{player_id}/history", response_model=List[schemas.MatchStat])
def player_history(player_id: int, token=Depends(auth.verify_jwt_token), db_session=Depends(db.get_db)):
    stats = crud.get_player_match_history(db_session, player_id)
    return stats
