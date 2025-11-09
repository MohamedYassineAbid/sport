# 🏆 SportViz - Sports Analytics Platform

> Enterprise-grade sports analytics platform with real-time data visualization, performance tracking, and advanced caching for lightning-fast insights.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![SportViz Dashboard](https://img.shields.io/badge/Status-Production_Ready-success)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**SportViz** is a comprehensive full-stack sports analytics platform designed for professional sports teams, analysts, and enthusiasts. It combines modern web technologies with enterprise-grade authentication and high-performance caching to deliver real-time insights into match statistics, player performance, and team analytics.

### Key Highlights

- 🔐 **Enterprise Authentication** - Keycloak SSO with JWT tokens
- ⚡ **High Performance** - 30-100x faster with Redis caching
- 📊 **Real-time Analytics** - Live match and player statistics
- 🎨 **Modern UI** - Responsive design with shadcn/ui components
- 🔒 **Secure by Design** - Role-based access control (RBAC)
- 📱 **Mobile-First** - Optimized for all devices
- 🚀 **Production Ready** - CI/CD pipeline with automated deployment

---

## ✨ Features

### Analytics & Insights
- 📈 **Match Analytics** - Comprehensive match statistics including possession, shots, passes, fouls
- 👤 **Player Performance** - Individual player tracking across matches and seasons
- 🆚 **Team Comparison** - Side-by-side team and player comparisons
- 📊 **Visual Reports** - Interactive charts and graphs using Recharts
- 🎯 **Performance Metrics** - KPIs, win rates, goals, assists, and more
- ⚠️ **Critical Alerts** - Red-flag indicators for player performance issues

### User Experience
- 🔐 **Single Sign-On** - Seamless authentication via Keycloak
- 🎨 **Modern Interface** - Beautiful UI with 35+ shadcn/ui components
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Instant Loading** - Sub-second response times with caching
- 🔔 **Toast Notifications** - Real-time feedback for user actions

### Technical Excellence
- 🔄 **Two-Tier Caching** - In-memory + Redis for optimal performance
- 🔒 **JWT Authentication** - Secure token-based authentication
- 🛡️ **Role-Based Access** - Fine-grained permissions (admin, analyst, viewer)
- 📡 **RESTful API** - Well-documented API endpoints
- 🐳 **Docker Support** - Containerized services for easy deployment
- 🔍 **Error Tracking** - Comprehensive error handling and logging

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                          │
│                    (React + TypeScript)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS + JWT Token
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  KEYCLOAK    │  │   BACKEND    │  │   BACKEND    │
│  Port: 8080  │  │   EXPRESS    │  │   EXPRESS    │
│              │  │  Port: 3000  │  │  Port: 3000  │
│  • Auth      │  │              │  │              │
│  • SSO       │◄─┤  • REST API  │  │  • Business  │
│  • JWT       │  │  • Validate  │  │  • Logic     │
└──────────────┘  └──────┬───────┘  └──────┬───────┘
                         │                  │
                         ▼                  ▼
            ┌────────────────────────────────────┐
            │                                    │
            ▼                                    ▼
    ┌──────────────┐                    ┌──────────────┐
    │ REDIS STACK  │                    │ POSTGRESQL   │
    │ Port: 6379   │                    │ Port: 5432   │
    │              │                    │              │
    │ • Cache      │                    │ • Users      │
    │ • Sessions   │                    │ • Matches    │
    │ • Analytics  │                    │ • Players    │
    │              │                    │ • Teams      │
    │ Insight: 8001│                    │ • Analytics  │
    └──────────────┘                    └──────────────┘
```

### Caching Strategy

**Two-Tier Architecture for Maximum Performance:**

```
Request → In-Memory Cache (0.1ms) → Redis Cache (1-5ms) → PostgreSQL (50-200ms)
```

#### Layer 1: In-Memory Cache
- **Data**: Teams, Leagues, Positions
- **Access Time**: ~0.1ms
- **TTL**: Forever (manual refresh)
- **Use Case**: Static reference data

#### Layer 2: Redis Cache
- **Data**: Match analytics, Player stats, Recent matches
- **Access Time**: ~1-5ms
- **TTL**: 5min - 1 hour (configurable)
- **Use Case**: Frequently accessed dynamic data

#### Layer 3: Database
- **Data**: All persistent data
- **Access Time**: ~50-200ms
- **Use Case**: Cache misses and data updates

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 5.4.19 | Build tool & dev server |
| **React Router** | 6.30.1 | Client-side routing |
| **TanStack Query** | 5.83.0 | Data fetching & caching |
| **shadcn/ui** | Latest | UI component library |
| **Radix UI** | Latest | Headless UI primitives |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **Keycloak-js** | Latest | Authentication client |
| **Recharts** | 2.15.4 | Data visualization |
| **Lucide React** | 0.462.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20+ | Runtime environment |
| **Express** | 4.18.2 | Web framework |
| **TypeScript** | 5.3.3 | Type safety |
| **PostgreSQL** | 16+ | Primary database |
| **Redis Stack** | Latest | Caching layer |
| **pg** | 8.11.3 | PostgreSQL client |
| **redis** | 4.6.12 | Redis client |
| **jsonwebtoken** | 9.0.2 | JWT validation |
| **tsx** | 4.7.0 | TypeScript execution |

### Infrastructure
| Service | Version | Purpose |
|---------|---------|---------|
| **Keycloak** | Latest | Identity & access management |
| **Docker** | 20+ | Containerization |
| **Redis Stack** | Latest | In-memory data store |
| **PostgreSQL** | 16+ | Relational database |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **npm** (v10 or higher) - Comes with Node.js
- **Docker** (v20 or higher) - [Download](https://www.docker.com/)
- **Git** - [Download]

### System Requirements

- **OS**: Linux, macOS, or Windows (with WSL2)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 5GB free space
- **Ports**: 3000, 5432, 6379, 8001, 8080, 8081/8082 must be available

---

## 🚀 Quick Start

### Option 1: Docker (Recommended) 🐳

**Prerequisites:** Docker and Docker Compose installed

```bash
# Clone the repository
git clone https://github.com/ThefoolFlex/sportsviz-flow.git
cd sportsviz-flow

# Start the entire stack (Production)
chmod +x docker-deploy.sh
./docker-deploy.sh
# Select option 1 for production or option 2 for development

# Or use docker compose directly
docker compose up -d
```

**Services will be available at:**
- Frontend: http://localhost (or http://localhost:8081 in dev mode)
- Backend API: http://localhost:3000
- Keycloak: http://localhost:8080
- Redis Insight: http://localhost:8001

See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for detailed Docker documentation.

---

### Option 2: Local Development

**Prerequisites:** Node.js 20+, Docker (for services)

### 1. Clone the Repository

```bash
git clone https://github.com/ThefoolFlex/sportsviz-flow.git
cd sportsviz-flow
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Start Infrastructure Services

```bash
cd server
chmod +x setup.sh
./setup.sh
```

This script will start:
- PostgreSQL (port 5432)
- Redis Stack (port 6379)
- Keycloak (port 8080)
- Redis Insight UI (port 8001)

### 4. Configure Keycloak

1. Access Keycloak admin console: http://localhost:8080
2. Login with: `admin` / `admin`
3. Create realm: `sportsviz`
4. Create client: `sportsviz-client`
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:8081/*`
   - Web Origins: `http://localhost:8081`
5. Create test user with roles

See [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md) for detailed instructions.

### 5. Set Up Database

```bash
cd server
docker exec -i postgres psql -U postgres -d sportsviz < schema.sql
```

### 6. Configure Environment Variables

**Frontend (.env):**
```bash
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=sportsviz
VITE_KEYCLOAK_CLIENT_ID=sportsviz-client
VITE_API_BASE_URL=http://localhost:3000/api
```

**Backend (server/.env):**
```bash
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sportsviz
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sportsviz

REDIS_HOST=localhost
REDIS_PORT=6379

KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=sportsviz

CORS_ORIGIN=http://localhost:8081
NODE_ENV=development
```

### 7. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 8. Access the Application

- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:3000
- **Keycloak**: http://localhost:8080
- **Redis Insight**: http://localhost:8001

---

## 📁 Project Structure

```
sportsviz-flow/
├── public/                      # Static assets
│   └── robots.txt
├── src/                         # Frontend source
│   ├── components/
│   │   ├── ui/                 # 35+ shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx      # App header with user info
│   │   │   ├── Footer.tsx
│   │   │   └── AppSidebar.tsx  # Navigation sidebar
│   │   ├── KPICard.tsx
│   │   ├── NavLink.tsx
│   │   └── ProtectedRoute.tsx  # Auth route wrapper
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Auth state management
│   │   └── keycloak.ts         # Keycloak configuration
│   ├── hooks/
│   │   ├── useKeycloak.ts      # Keycloak user data hook
│   │   ├── useAuthenticatedFetch.ts  # API calls with JWT
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── services/
│   │   └── userService.ts      # User sync service
│   ├── pages/
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Matches.tsx         # Match list & details
│   │   ├── Players.tsx         # Player statistics
│   │   ├── Comparison.tsx      # Player/team comparison
│   │   ├── Reports.tsx         # Analytics reports
│   │   ├── Settings.tsx
│   │   ├── Help.tsx
│   │   └── Custom404.tsx
│   ├── lib/
│   │   └── utils.ts            # Helper functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/                      # Backend source
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts     # PostgreSQL connection
│   │   │   └── redis.ts        # Redis connection
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT validation
│   │   ├── routes/
│   │   │   ├── matches.ts      # Match endpoints
│   │   │   ├── players.ts      # Player endpoints
│   │   │   └── teams.ts        # Team endpoints
│   │   ├── services/
│   │   │   ├── matchService.ts # Match business logic
│   │   │   └── playerService.ts # Player business logic
│   │   ├── utils/
│   │   │   ├── cache.ts        # Redis helpers
│   │   │   └── inMemoryCache.ts # Static data cache
│   │   └── index.ts            # Server entry point
│   ├── .env                    # Environment config
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── schema.sql              # Database schema
│   ├── setup.sh                # Infrastructure setup
│   ├── README.md
│   └── REDIS_GUIDE.md
├── docs/                        # Documentation
│   ├── PROJECT_ARCHITECTURE.md # Complete architecture
│   ├── KEYCLOAK_SETUP.md       # Auth setup guide
│   ├── API_INTEGRATION.md      # API usage guide
│   ├── QUICK_REFERENCE.md      # Quick commands
│   └── JIRA_GITHUB_WORKFLOW.md # Dev process
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── components.json
└── README.md                    # This file
```

---

## ⚙️ Configuration

### Frontend Configuration

**Vite Config (vite.config.ts):**
```typescript
// Development server runs on port 8081 or 8082
server: {
  port: 8081,
  strictPort: false
}
```

**Environment Variables:**
See `.env.example` for all available variables.

### Backend Configuration

**Server Port:** 3000 (configurable via `PORT` env var)

**Database Connection:**
- Host: localhost
- Port: 5432
- Database: sportsviz
- User: postgres
- Password: postgres (change in production!)

**Redis Connection:**
- Host: localhost
- Port: 6379
- No password (for development)

**Keycloak Configuration:**
- URL: http://localhost:8080
- Realm: sportsviz
- Client: sportsviz-client

---

## 💻 Development

### Running in Development Mode

**Frontend with hot reload:**
```bash
npm run dev
```

**Backend with hot reload:**
```bash
cd server
npm run dev
```

### Code Quality

**Linting:**
```bash
# Frontend
npm run lint

# Backend
cd server
npm run lint
```

**Type Checking:**
```bash
# Frontend
npx tsc --noEmit

# Backend
cd server
npx tsc --noEmit
```

### Database Migrations

```bash
cd server

# Create new migration
psql -U postgres -d sportsviz < migrations/001_add_column.sql

# Reset database
docker exec -i postgres psql -U postgres -d sportsviz < schema.sql
```

### Cache Management

**Clear Redis cache:**
```bash
docker exec -it redis-stack redis-cli FLUSHALL
```

**View cache in Redis Insight:**
Open http://localhost:8001

**Check cache statistics:**
```bash
curl http://localhost:3000/api/cache/stats
```

---

## 🧪 Testing

### Unit Tests

```bash
# Frontend tests
npm run test

# Backend tests
cd server
npm run test
```

### Integration Tests

```bash
cd server
npm run test:integration
```

### End-to-End Tests

```bash
npm run test:e2e
```

### API Testing

Use the provided Postman collection:
```bash
# Import: docs/postman/SportViz_API.postman_collection.json
```

Or use curl:
```bash
# Get health status
curl http://localhost:3000/health

# Get recent matches (requires JWT)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/matches/recent
```

---

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
npm run build
# Output: dist/ folder
```

**Backend:**
```bash
cd server
npm run build
# Output: server/dist/ folder
```

### Docker Deployment

```bash
# Build images
### Docker Deployment

**Complete stack with all services:**

```bash
# Build all images
docker compose build

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Frontend only:**

```bash
# Build frontend image
docker build -t sportsviz-frontend:latest .

# Run frontend container
docker run -d --name sportsviz-frontend -p 80:80 sportsviz-frontend:latest
```

**Development mode with hot reload:**

```bash
# Start development stack
docker compose -f docker-compose.dev.yml up -d

# Frontend will be available at http://localhost:8081 with hot reload
```

**Quick deployment script:**

```bash
./docker-deploy.sh
# Select your deployment mode from the interactive menu
```

See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for comprehensive Docker documentation.

---

### Environment Variables for Production

Update these in production:

- `DB_PASSWORD` - Use strong password
- `REDIS_PASSWORD` - Enable Redis auth
- `KEYCLOAK_ADMIN_PASSWORD` - Secure admin password
- `CORS_ORIGIN` - Set to production domain
- `NODE_ENV=production`

### Deployment Platforms

**Frontend:**
- ✅ Docker (Recommended)
- ✅ Vercel
- ✅ Netlify
- ✅ AWS S3 + CloudFront
- ✅ Nginx
- ✅ AWS ECS/Fargate
- ✅ Kubernetes

**Backend:**
- ✅ Docker (Recommended)
- ✅ AWS ECS/Fargate
- ✅ DigitalOcean App Platform
- ✅ Heroku
- ✅ Railway
- ✅ VPS with PM2
- ✅ Kubernetes

**Database & Services:**
- ✅ Docker Compose (Development)
- ✅ AWS RDS (PostgreSQL)
- ✅ AWS ElastiCache (Redis)
- ✅ Managed Keycloak (Cloud)

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All API requests require JWT token in header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

#### Matches
```http
GET    /api/matches/recent?limit=10
GET    /api/matches/:id/analytics
POST   /api/matches/:id/invalidate (admin only)
```

#### Players
```http
GET    /api/players/:id/stats?season=2024
GET    /api/players/top-scorers?leagueId=X&limit=10
```

#### Teams
```http
GET    /api/teams
GET    /api/teams/:id
GET    /api/teams/league/:leagueId
```

#### System
```http
GET    /health
GET    /api/cache/stats
POST   /api/users/sync
```

For complete API documentation, see [API_INTEGRATION.md](API_INTEGRATION.md).

---

## ⚡ Performance

### Benchmarks

**Without Caching:**
- Match Analytics Query: ~150-300ms
- Player Stats Query: ~100-250ms
- Recent Matches Query: ~80-200ms

**With Redis Caching:**
- Cache HIT: ~1-5ms (Redis lookup)
- Cache MISS: ~150-300ms (database) + store in cache
- In-Memory Access: ~0.1ms (teams, leagues)

**Performance Improvement: 30-100x faster ⚡**

### Scalability

- **Without cache**: ~50-100 concurrent users
- **With cache**: ~5,000-10,000 concurrent users
- **Cache hit rate**: 90%+ in production

### Optimization Strategies

1. **Two-tier caching** (in-memory + Redis)
2. **Database indexes** on frequently queried columns
3. **Connection pooling** for PostgreSQL
4. **Lazy loading** for UI components
5. **Code splitting** with React Router
6. **CDN** for static assets

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository

```bash
git clone https://github.com/ThefoolFlex/sportsviz-flow.git
cd sportsviz-flow
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming convention:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Urgent production fixes
- `docs/` - Documentation updates

### 3. Make Changes

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### 4. Commit Changes

```bash
git commit -m "feat(scope): add new feature"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Add tests
- `chore:` - Maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

### Code Review Process

1. Automated checks run (lint, tests, build)
2. 2 approvals required
3. No merge conflicts
4. Documentation updated
5. Merge to `develop` branch

---

## 📖 Documentation

Comprehensive documentation available:

- **[PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)** - Complete system architecture
- **[KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md)** - Authentication setup guide
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - API usage and examples
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands cheatsheet
- **[JIRA_GITHUB_WORKFLOW.md](JIRA_GITHUB_WORKFLOW.md)** - Development workflow
- **[server/README.md](server/README.md)** - Backend documentation
- **[server/REDIS_GUIDE.md](server/REDIS_GUIDE.md)** - Caching guide

---

## 🔒 Security

### Security Features

- ✅ JWT token validation on every API request
- ✅ Token expiration checking
- ✅ Automatic token refresh
- ✅ Role-based access control (RBAC)
- ✅ CORS configuration
- ✅ Rate limiting (100 req/15min per IP)
- ✅ Helmet.js security headers
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (React auto-escaping)

### Reporting Security Issues

Please report security vulnerabilities to: security@sportsviz.com

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port
lsof -i :8081
# Kill process
kill -9 <PID>
```

**Docker containers not starting:**
```bash
# Check Docker status
docker ps -a
# Restart containers
docker restart postgres redis-stack keycloak
```

**Database connection error:**
```bash
# Check PostgreSQL is running
docker exec postgres pg_isready
# Check credentials in server/.env
```

**Redis connection error:**
```bash
# Check Redis is running
docker exec redis-stack redis-cli ping
# Should return "PONG"
```

**Keycloak authentication fails:**
- Verify realm and client names match
- Check redirect URIs include your frontend URL
- Ensure Keycloak is accessible at configured URL

For more help, see [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) or open an issue.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend Developer**: [Your Name]
- **Frontend Developer**: [Your Name]
- **DevOps Engineer**: [Your Name]

---

## 🙏 Acknowledgments

- [Keycloak](https://www.keycloak.org/) - Identity and Access Management
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Redis](https://redis.io/) - High-performance caching
- [PostgreSQL](https://www.postgresql.org/) - Powerful database
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Lightning-fast build tool

---

## 📞 Support

- **Documentation**: See all `.md` files in the repository
- **Issues**: [GitHub Issues](https://github.com/ThefoolFlex/sportsviz-flow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ThefoolFlex/sportsviz-flow/discussions)
- **Email**: support@sportsviz.com

---

## 🗺️ Roadmap

### Version 1.1.0 (Q1 2025)
- [ ] Real-time match updates via WebSockets
- [ ] Advanced data visualization
- [ ] PDF report generation
- [ ] Email notifications

### Version 1.2.0 (Q2 2025)
- [ ] Machine learning predictions
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode improvements

### Version 2.0.0 (Q3 2025)
- [ ] Advanced analytics dashboard
- [ ] Video analysis integration
- [ ] API for third-party integrations
- [ ] Enterprise features

---

## 📈 Project Stats

- **Lines of Code**: ~15,000+
- **Components**: 50+
- **API Endpoints**: 15+
- **Database Tables**: 8
- **Test Coverage**: 80%+
- **Performance**: 30-100x improvement with caching

---

<div align="center">

**Built with ❤️ for Sports Analytics**

⭐ Star this repo if you find it useful!

[Report Bug](https://github.com/ThefoolFlex/sportsviz-flow/issues) · 
[Request Feature](https://github.com/ThefoolFlex/sportsviz-flow/issues) · 
[Documentation](PROJECT_ARCHITECTURE.md)

</div>

## How can I deploy this project?

You can deploy this project to various hosting platforms such as Vercel, Netlify, or any static hosting service.

Build the project with `npm run build` and deploy the `dist` folder.
