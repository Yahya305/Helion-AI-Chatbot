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

