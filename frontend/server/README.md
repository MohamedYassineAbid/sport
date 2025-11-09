# Sports Analytics Backend Server

Backend API server with Redis Stack caching, PostgreSQL database, and Keycloak authentication.

## Quick Start

### 1. Start Services

```bash
# Start Redis Stack
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest

# Start PostgreSQL (if not already running)
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=yourpassword postgres:latest

# Start Keycloak (if not already running)
docker run -d --name keycloak -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database and Redis credentials
```

### 4. Run Server

```bash
# Development mode with auto-reload
npm run dev

# Production build
npm run build
npm start
```

Server will run on http://localhost:3000

## Features

✅ **Redis Stack Caching**
- Smart cache-then-database pattern
- Configurable TTLs for different data types
- 30-100x performance improvement

✅ **In-Memory Cache**
- Static data (teams, leagues, positions) loaded at startup
- Instant access with zero latency

✅ **Keycloak Authentication**
- JWT token validation
- Role-based access control
- User data sync to PostgreSQL

✅ **RESTful API**
- Match analytics endpoints
- Player statistics endpoints
- Team management endpoints
- Cache management endpoints

## API Endpoints

All endpoints require Keycloak JWT token in Authorization header.

### Matches
- `GET /api/matches/recent?limit=10` - Recent matches
- `GET /api/matches/:id/analytics` - Match analytics with caching
- `POST /api/matches/:id/invalidate` - Invalidate match cache

### Players
- `GET /api/players/:id/stats?season=2024` - Player statistics
- `GET /api/players/top-scorers?leagueId=X&limit=10` - Top scorers

### Teams
- `GET /api/teams` - All teams (in-memory cache)
- `GET /api/teams/:id` - Team by ID
- `GET /api/teams/league/:leagueId` - Teams by league

### System
- `GET /health` - Health check
- `GET /api/cache/stats` - Cache statistics

## Cache Strategy

| Endpoint | Cache Type | TTL |
|----------|-----------|-----|
| Match analytics | Redis | 30 min |
| Player stats | Redis | 1 hour |
| Recent matches | Redis | 5 min |
| Teams/Leagues | In-Memory | Forever |

## Documentation

- **[REDIS_GUIDE.md](./REDIS_GUIDE.md)** - Complete Redis integration guide
- **[API Examples](./REDIS_GUIDE.md#api-endpoints)** - API usage examples

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.ts      # PostgreSQL connection
│   │   └── redis.ts         # Redis connection
│   ├── middleware/
│   │   └── auth.ts          # Keycloak JWT validation
│   ├── routes/
│   │   ├── matches.ts       # Match endpoints
│   │   ├── players.ts       # Player endpoints
│   │   └── teams.ts         # Team endpoints
│   ├── services/
│   │   ├── matchService.ts  # Match business logic + caching
│   │   └── playerService.ts # Player business logic + caching
│   ├── utils/
│   │   ├── cache.ts         # Redis helper functions
│   │   └── inMemoryCache.ts # In-memory cache for static data
│   └── index.ts             # Main server file
├── .env.example
├── package.json
├── tsconfig.json
└── REDIS_GUIDE.md
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode (auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
```env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/sportsviz
REDIS_HOST=localhost
REDIS_PORT=6379
KEYCLOAK_URL=http://localhost:8080
CORS_ORIGIN=http://localhost:8081
```

## Testing the API

```bash
# Get JWT token from Keycloak (after logging in from frontend)
TOKEN="your-jwt-token"

# Test match analytics (demonstrates cache-then-database pattern)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/matches/123/analytics

# First request: Cache MISS → queries database → stores in Redis
# Second request: Cache HIT → returns from Redis instantly

# Test teams (in-memory cache)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/teams

# Check cache stats
curl http://localhost:3000/api/cache/stats
```

## Monitoring

- **Redis Insight UI**: http://localhost:8001
- **Health Check**: http://localhost:3000/health
- **Server Logs**: Watch console for cache HIT/MISS logs

## Production Checklist

- [ ] Set strong `REDIS_PASSWORD`
- [ ] Enable Redis persistence (RDB/AOF)
- [ ] Use proper Keycloak public key validation
- [ ] Set up database connection pooling
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up database backups

## License

MIT
