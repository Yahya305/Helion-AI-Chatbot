"""
PostgreSQL database connection and management utilities.
Handles database initialization, connection management, and cleanup.
"""

import logging
from typing import Optional, Generator, TYPE_CHECKING
from psycopg import Connection
from psycopg.rows import dict_row
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import SQLAlchemyError
from . import constants


logger = logging.getLogger(__name__)

engine = create_engine(
    constants.POSTGRES_URI,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=True,  # set to False in production if noisy
    future=True,
    connect_args={
        "options": "-c timezone=utc",
        "application_name": "Agent 2.0",
        "connect_timeout": 10,
    },
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)

# Base for ORM models
Base = declarative_base()


def get_orm_session() -> Generator[Session, None, None]:
    """Dependency for FastAPI routes (request-scoped session)."""
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        logger.error(f"Database error occurred: {e}")
        db.rollback()
        raise
    finally:
        db.close()


# ---------------------------------------------------------
# Psycopg3 Connection Setup (for LangGraph PostgresSaver)
# ---------------------------------------------------------
if TYPE_CHECKING:
    from psycopg import Connection as PGConnection
else:
    PGConnection = Connection


class DatabaseConnectionPsycopg:
    conn: PGConnection | None = None

    def set_connection(self, db_connection: Connection):
        self.conn = db_connection


_DatabaseConnPsycopg = DatabaseConnectionPsycopg()


def initialize_database() -> PGConnection:
    """
    Initialize the PostgreSQL database connection for the customer support agent.
    This connection is psycopg3-based and compatible with LangGraph PostgresSaver.
    """
    try:

        db_uri=f"postgresql://{constants.POSTGRES_USER}:{constants.POSTGRES_PASSWORD}@localhost:5433/{constants.POSTGRES_DB}"
        connection = Connection.connect(
            db_uri,
            autocommit=True,
            prepare_threshold=0,
            row_factory=dict_row,
        )



        # Test the connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

            # Ensure pgvector extension is installed
            cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")

            # Ensure semantic memory table exists
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS semantic_memories (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    content TEXT NOT NULL,
                    importance TEXT DEFAULT 'medium',
                    embedding vector(768),
                    created_at TIMESTAMP DEFAULT NOW()
                );
            """)

            # Optional: index for fast ANN search
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_semantic_memories_embedding
                ON semantic_memories
                USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100);
            """)

        logger.info(f"PostgreSQL (psycopg3) initialized successfully at: {db_uri}")
        _DatabaseConnPsycopg.set_connection(connection)
        return connection

    except Exception as e:
        logger.error(f"Failed to initialize PostgreSQL database: {e}")
        raise

def get_psycopg_db_connection() -> PGConnection:
    """Retrieve the global psycopg3 connection (for LangGraph)."""
    if not _DatabaseConnPsycopg.conn:
        raise RuntimeError("Psycopg connection not initialized. Call initialize_database() first.")
    return _DatabaseConnPsycopg.conn

def close_psycopg_connection(connection: Optional[PGConnection]) -> None:
    """Close PostgreSQL connection."""
    if connection:
        try:
            connection.close()
            print("Database connection closed successfully.")
        except Exception as e:
            print(f"Error during database cleanup: {e}")


def check_database_health(connection: PGConnection) -> dict:
    """
    Check PostgreSQL health.
    """
    health_report = {
        "connection_ok": False,
        "errors": []
    }

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
            health_report["connection_ok"] = True

            cursor.execute("SELECT version();")
            health_report["version"] = cursor.fetchone()[0]

    except Exception as e:
        health_report["errors"].append(str(e))

    return health_report
