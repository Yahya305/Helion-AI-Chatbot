"""
Utils package initialization.
Exposes utility functions for database, conversation, and streaming operations.
"""

# Database utilities
from .database import (
    initialize_database,
    close_psycopg_connection,
    check_database_health,
    get_psycopg_db_connection
)

# Conversation utilities
from .conversation import (
    generate_new_thread_id,
    display_conversation_history,
    display_messages,
    get_conversation_summary,
    run_single_interaction,
    export_conversation,
    search_conversation_history,
    get_active_threads
)

# Streaming utilities
from .streaming import (
    stream_response,
)

__all__ = [
    # Database
    "initialize_database",
    "close_psycopg_connection", 
    "check_database_health",
    "get_psycopg_db_connection",
    
    # Conversation
    "generate_new_thread_id",
    "display_conversation_history",
    "display_messages",
    "get_conversation_summary", 
    "run_single_interaction",
    "export_conversation",
    "search_conversation_history",
    "get_active_threads",
    
    # Streaming
    "stream_response"
]