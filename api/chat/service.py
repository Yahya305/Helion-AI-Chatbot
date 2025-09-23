# chat/service.py
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import text
from support_agent import Agent
from .dto.dto import ChatMessageDTO
from uuid import uuid4
import logging

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self, db: Session, agent: Agent):
        self.db = db
        self.agent = agent

    def send_message(self, message: ChatMessageDTO, user_id: str):
        thread_id = message.thread_id or str(uuid4())

        return "Helloo"

        return self.agent.invoke(
            user_input=message.user_input,
            thread_id=thread_id,
            user_id=user_id,
        )



    def get_latest_messages(self, thread_id: str, limit: int = 10) -> List[dict]:
        """
        Retrieve the latest `limit` messages for a given thread_id
        from the checkpoints table.
        """
        try:
            query = text("""
                SELECT checkpoint_id, parent_checkpoint_id, type, checkpoint, metadata
                FROM checkpoints
                WHERE thread_id = :thread_id
                ORDER BY checkpoint_id DESC
                LIMIT :limit
            """)

            result = self.db.execute(query, {"thread_id": thread_id, "limit": limit})
            rows = result.mappings().all()  # returns rows as dict-like objects

            return [dict(row) for row in rows]

        except Exception as e:
            logger.error(f"Error fetching messages for thread {thread_id}: {e}")
            raise

