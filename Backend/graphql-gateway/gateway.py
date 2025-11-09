from fastapi import FastAPI, Depends, HTTPException
from starlette.requests import Request
import requests
import graphene
from fastapi.middleware.cors import CORSMiddleware
from graphene import ObjectType, String, Field
import os

# FastAPI app
app = FastAPI(title="GraphQL API Gateway")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy Auth Dependency (simulate Keycloak)
def verify_token(request: Request):
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    # In real scenario, call Keycloak to verify JWT
    return token

# GraphQL Services URLs (these would point to your ACI services)
PLAYER_SERVICE_URL = os.getenv("PLAYER_SERVICE_URL", "http://player-service:8001/graphql")
MATCH_SERVICE_URL = os.getenv("MATCH_SERVICE_URL", "http://match-service:8002/graphql")
TEAM_SERVICE_URL = os.getenv("TEAM_SERVICE_URL", "http://team-service:8003/graphql")

# Graphene schema
class Query(ObjectType):
    hello = String(description="Test endpoint for gateway")
    player_service_status = String(description="Check Player service")

    async def resolve_hello(root, info):
        return "Hello from GraphQL Gateway!"

    async def resolve_player_service_status(root, info):
        try:
            response = requests.get(f"{PLAYER_SERVICE_URL}/status")
            return f"Player service status: {response.text}"
        except Exception as e:
            return f"Player service unreachable: {e}"

schema = graphene.Schema(query=Query)

from starlette.graphql import GraphQLApp

# Mount GraphQL endpoint
app.add_route("/graphql", GraphQLApp(schema=schema))

# Healthcheck endpoint
@app.get("/status")
async def status():
    return {"status": "gateway running"}
