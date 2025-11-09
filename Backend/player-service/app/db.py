# player-service/app/db.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Generator

# Example connection string (use Azure SQL / Azure PostgreSQL in real deployment)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/analytics_db")

# Synchronous engine for demo. For production, prefer async engines.
engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
