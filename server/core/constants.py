import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

api_key=os.getenv("api_key")
ENV=os.getenv("ENV")
FRONTEND_URL=os.getenv("FRONTEND_URL")


# Services
LANGSMITH_TRACING=os.getenv("LANGSMITH_TRACING")
LANGSMITH_ENDPOINT=os.getenv("LANGSMITH_ENDPOINT")
LANGSMITH_API_KEY=os.getenv("LANGSMITH_API_KEY")
LANGSMITH_PROJECT=os.getenv("LANGSMITH_PROJECT")
TAVILY_API_KEY=os.getenv("TAVILY_API_KEY")
FIRECRAWL_API_KEY=os.getenv("FIRECRAWL_API_KEY")

# Models
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")
MODEL_NAME=os.getenv("MODEL_NAME")

# Tokens
ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")
REFRESH_TOKEN_SECRET = os.getenv("REFRESH_TOKEN_SECRET")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS"))

# Database
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")
PGADMIN_EMAIL = os.getenv("PGADMIN_DEFAULT_EMAIL")
PGADMIN_PASSWORD = os.getenv("PGADMIN_DEFAULT_PASSWORD")

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if DATABASE_URL:
    # Use the provided DATABASE_URL for production
    # Ensure it works with SQLAlchemy (might need +psycopg if strictly required, but usually auto-detects)
    # If we want to enforce psycopg3 in SQLAlchemy:
    if "postgresql://" in DATABASE_URL and "+psycopg" not in DATABASE_URL:
        POSTGRES_URI = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
    else:
        POSTGRES_URI = DATABASE_URL
    
    # For raw psycopg connection
    POSTGRES_CONNECTION_URI = DATABASE_URL
else:
    # Local development
    POSTGRES_URI = f"postgresql+psycopg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:5433/{POSTGRES_DB}"
    POSTGRES_CONNECTION_URI = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:5433/{POSTGRES_DB}"
