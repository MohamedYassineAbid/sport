# match-service/app/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # Demo decode - do full verification in production
        payload = jwt.decode(token, options={"verify_signature": False, "verify_exp": False})
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
