# chat/service.py
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import text
from agent import Agent
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

        # return "Helloo"

        return self.agent.invoke(
            user_input=message.user_input,
            thread_id=thread_id,
            user_id=user_id,
        )



    def get_latest_messages(self, thread_id: str, limit: int = 10) -> List[dict]:
        """
        Retrieve the latest messages for a given thread_id using the agent state.
        """
        return self.agent.get_conversation_history(thread_id)

    def list_user_threads(self, user_id: str) -> List[dict]:
        """
        List all chat threads for a user by querying the checkpoints table.
        Returns a list of threads with their metadata.
        """
        query = text("""
            SELECT DISTINCT
                thread_id,
                MAX(checkpoint_id) as latest_checkpoint_id,
                MAX(created_at) as last_updated
            FROM checkpoints
            WHERE metadata->>'user_id' = :user_id
            GROUP BY thread_id
            ORDER BY last_updated DESC
        """)
        
        result = self.db.execute(query, {"user_id": user_id})
        threads = []
        
        for row in result:
            thread_id = row.thread_id
            # Get the first message to use as title
            messages = self.get_latest_messages(thread_id, limit=1)
            
            title = "New Chat"
            last_message = ""
            
            if messages and len(messages) > 0:
                first_msg = messages[0]
                # Use first user message as title
                if first_msg.get('role') == 'user':
                    content = first_msg.get('content', '')
                    title = content[:50] + ('...' if len(content) > 50 else '')
                    last_message = content[:100]
            
            threads.append({
                "id": thread_id,
                "title": title,
                "lastMessage": last_message,
                "timestamp": row.last_updated.isoformat() if row.last_updated else None
            })
        
        return threads

