# team-service/app/main.py
from fastapi import FastAPI, Depends, HTTPException, Query
from . import db, models
from .db import engine
from typing import List, Optional
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import logging
from sqlalchemy.orm import Session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("team-service")
app = FastAPI(title="Team Service")

# create tables for demo
@app.on_event("startup")
def startup():
    models.Base = db.Base
    models.Base.metadata.create_all(bind=engine)
    logger.info("Team service started.")

security = HTTPBearer()

def fake_verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Demo token decode, production should verify with Keycloak JWKS
    token = credentials.credentials
    # Do not implement real verification in demo
    return {"realm_access": {"roles": ["analyst"]}}

@app.get("/teams", response_model=List[models.__dict__.get('DimTeam', None)])
def list_teams(q: Optional[str] = Query(None), limit: int = 50, token: dict = Depends(fake_verify_token), db_session: Session = Depends(db.get_db)):
    # For brevity, we return a raw query result; in production map to Pydantic models
    query = db_session.query(models.DimTeam)
    if q:
        query = query.filter(models.DimTeam.team_name_std.ilike(f"%{q}%"))
    teams = query.limit(limit).all()
    return teams

@app.get("/teams/{team_id}")
def get_team(team_id: int, token: dict = Depends(fake_verify_token), db_session: Session = Depends(db.get_db)):
    t = db_session.query(models.DimTeam).filter(models.DimTeam.team_id == team_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Team not found")
    return t
