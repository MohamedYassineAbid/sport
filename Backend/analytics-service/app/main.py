# analytics-service/app/main.py
from fastapi import FastAPI, Depends, HTTPException, Query
from .db import get_db
from .ml import load_model, predict
from typing import Optional
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import redis
import json
import os
import logging

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("analytics-service")

# App
app = FastAPI(title="Analytics Service")

# Auth dependency (demo)
security = HTTPBearer()
def verify_token(creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials
    # Demo decode; in production verify signature and SN/roles
    import jwt
    try:
        payload = jwt.decode(token, options={"verify_signature": False, "verify_exp": False})
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# Redis client (optional)
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
redis_client = None
try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()
    logger.info("Connected to Redis")
except Exception as e:
    redis_client = None
    logger.warning(f"Redis not available: {e}")

# Load ML model at startup
MODEL = load_model()

@app.get("/healthz")
def health():
    return {"status": "ok", "service": "analytics-service"}

@app.get("/predict/player/{player_id}")
def predict_player(player_id: int, next_match_id: Optional[int] = None, token=Depends(verify_token)):
    """
    Predict the Match Readiness Score for a player for the next match.
    Steps:
     - Check Redis cache (keyed by player+match)
     - If missing: query data warehouse for features (stub here)
     - Call model to predict
     - Cache prediction and return
    """
    cache_key = f"pred:player:{player_id}:match:{next_match_id or 'next'}"
    if redis_client:
        cached = redis_client.get(cache_key)
        if cached:
            logger.info("Returning cached prediction")
            return json.loads(cached)

    # === Feature assembly (demo stub) ===
    # In real app: query the DB for last N days, compute J-day cycle and engineered features
    features = {
        "recent_goals": 1,
        "recent_xg": 0.8,
        "avg_distance_km": 9.2,
        "sprint_count_avg": 6,
        "jday_pattern": [5, 3, 2, 1],  # simplified
    }

    # Perform prediction
    score = predict(MODEL, features)

    response = {
        "player_id": player_id,
        "match_id": next_match_id,
        "predicted_readiness": round(score, 2),
        "model": os.getenv("MLFLOW_MODEL_URI", "demo-fallback")
    }

    # Cache for short TTL in seconds
    if redis_client:
        try:
            redis_client.setex(cache_key, 60 * 5, json.dumps(response))  # 5 min cache
        except Exception as e:
            logger.warning(f"Failed to cache prediction: {e}")

    return response
