"""
PostgreSQL database connection and management utilities.
Handles database initialization, connection management, and cleanup.
"""

import os
import logging
from typing import Optional, Dict, Any, Generator, TYPE_CHECKING
from psycopg import Connection
from psycopg.rows import dict_row
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import SQLAlchemyError
from config.settings import get_database_config
from core import constants


logger = logging.getLogger(__name__)


# ---------------------------------------------------------
# SQLAlchemy ORM Setup (for FastAPI)
# ---------------------------------------------------------
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


def get_db() -> Generator[Session, None, None]:
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


class DatabaseConnection:
    conn: PGConnection | None = None

    def set_connection(self, db_connection: Connection):
        self.conn = db_connection


DatabaseConn = DatabaseConnection()


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
        DatabaseConn.set_connection(connection)
        return connection

    except Exception as e:
        logger.error(f"Failed to initialize PostgreSQL database: {e}")
        raise

def getDBConnection() -> PGConnection:
    """Retrieve the global psycopg3 connection (for LangGraph)."""
    if not DatabaseConn.conn:
        raise RuntimeError("Psycopg connection not initialized. Call initialize_database() first.")
    return DatabaseConn.conn

def cleanup_database(connection: Optional[PGConnection]) -> None:
    """Close PostgreSQL connection."""
    if connection:
        try:
            connection.close()
            print("Database connection closed successfully.")
        except Exception as e:
            print(f"Error during database cleanup: {e}")


def get_database_info(connection: PGConnection) -> Dict[str, Any]:
    """
    Get info about tables and row counts in PostgreSQL database.
    """
    try:
        db_info = {"tables": {}}
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema='public'
            """)
            tables = cursor.fetchall()

            for (table_name,) in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                row_count = cursor.fetchone()[0]

                cursor.execute(f"""
                    SELECT column_name, data_type, is_nullable
                    FROM information_schema.columns
                    WHERE table_name = %s
                """, (table_name,))
                columns = cursor.fetchall()

                db_info["tables"][table_name] = {
                    "row_count": row_count,
                    "columns": [
                        {"name": c[0], "type": c[1], "not_null": c[2] == "NO"}
                        for c in columns
                    ]
                }

        return db_info

    except Exception as e:
        print(f"Error getting database info: {e}")
        return {"error": str(e)}


def vacuum_database(connection: PGConnection) -> bool:
    """Run VACUUM ANALYZE in PostgreSQL."""
    try:
        with connection.cursor() as cursor:
            print("Running VACUUM ANALYZE...")
            cursor.execute("VACUUM ANALYZE;")
        print("VACUUM ANALYZE completed successfully.")
        return True
    except Exception as e:
        print(f"Error during database vacuum: {e}")
        return False


def backup_database(backup_path: str) -> bool:
    """
    Backup PostgreSQL database using pg_dump command.
    """
    try:
        db_config = get_database_config()
        db_uri = db_config.get("uri")

        os.system(f'pg_dump "{db_uri}" > "{backup_path}"')
        print(f"Database backed up successfully to: {backup_path}")
        return True
    except Exception as e:
        print(f"Error during database backup: {e}")
        return False


def restore_database(backup_path: str) -> bool:
    """
    Restore PostgreSQL database using psql command.
    """
    try:
        db_config = get_database_config()
        db_uri = db_config.get("uri")

        os.system(f'psql "{db_uri}" < "{backup_path}"')
        print(f"Database restored successfully from: {backup_path}")
        return True
    except Exception as e:
        print(f"Error during database restore: {e}")
        return False


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
