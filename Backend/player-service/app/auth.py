# player-service/app/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os

security = HTTPBearer()
KEYCLOAK_JWKS_URL = os.getenv("KEYCLOAK_JWKS_URL", "")

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    # IMPORTANT: For hackathon/demo we will decode without verification.
    # In production: fetch JWKS, verify signature, check exp & claims.
    try:
        payload = jwt.decode(token, options={"verify_signature": False, "verify_exp": False})
        # Example claims: sub, preferred_username, realm_access.roles, team_id
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
