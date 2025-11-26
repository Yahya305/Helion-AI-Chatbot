# memories/dto/dto.py
from pydantic import BaseModel
from typing import Optional

class ChatMessageDTO(BaseModel):
    user_input: str
    thread_id: Optional[str] = None
    checkpoint_id: Optional[str] = None
