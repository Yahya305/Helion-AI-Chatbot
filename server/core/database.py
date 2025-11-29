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
    pool_recycle=300,  # Recycle connections every 5 minutes (matches Neon's timeout)
    pool_use_lifo=True,  # Use LIFO to reuse hot connections
    echo=True,  # set to False in production if noisy
    future=True,
    connect_args={
        "options": "-c timezone=utc",
        "application_name": "Helion",
        "connect_timeout": 10,
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
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


def initialize_database() -> None:
    """
    Initialize PostgreSQL-only setup like extensions and semantic memory table.
    This uses a short-lived connection ONLY for initialization.
    """
    try:
        db_uri = constants.POSTGRES_CONNECTION_URI

        init_conn = Connection.connect(
            db_uri,
            autocommit=True,
            prepare_threshold=0,
            row_factory=dict_row,
        )

        with init_conn.cursor() as cursor:
            cursor.execute("SELECT 1;")
            cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")

        init_conn.close()
        logger.info(f"PostgreSQL initialized successfully at: {db_uri}")

    except Exception as e:
        logger.error(f"Failed to initialize PostgreSQL database: {e}")
        raise


def get_psycopg_db_connection() -> Connection:
    """
    ALWAYS return a NEW psycopg3 connection.

    Required for LangGraph because:
    - tools run in parallel
    - psycopg connections are NOT thread-safe
    - shared connections break with pipeline errors
    """
    db_uri = constants.POSTGRES_CONNECTION_URI
    return Connection.connect(
        db_uri,
        autocommit=True,
        prepare_threshold=0,
        row_factory=dict_row,
    )


def close_psycopg_connection(connection: Optional[Connection]) -> None:
    """Close a psycopg3 connection safely."""
    if connection:
        try:
            connection.close()
        except Exception as e:
            print(f"Error closing psycopg connection: {e}")


def check_database_health(connection: Connection) -> dict:
    """Simple PostgreSQL health check."""
    report = {"connection_ok": False, "errors": []}

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
            report["connection_ok"] = True

            cursor.execute("SELECT version();")
            report["version"] = cursor.fetchone()[0]

    except Exception as e:
        report["errors"].append(str(e))

    return report