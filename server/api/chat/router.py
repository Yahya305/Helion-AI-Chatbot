# chat/router.py
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from core.database import get_orm_session
from .service import ChatService
from agent import Agent
from .dto.dto import ChatMessageDTO

chat_router = APIRouter(prefix="/chat", tags=["Chat"])


def get_agent(request: Request) -> Agent:
    return request.app.state.agent


def get_chat_service(
    db: Session = Depends(get_orm_session),
    agent: Agent = Depends(get_agent)
) -> ChatService:
    return ChatService(db, agent)


# ========= Endpoints ==========

@chat_router.post("/send")
def send_message(
    request: Request,
    message: ChatMessageDTO,
    chat_service: ChatService = Depends(get_chat_service),
):
    user_id = request.state.user['userId']
    return chat_service.send_message(message, user_id)


@chat_router.get("/{thread_id}")
def get_latest_messages(thread_id: str, service: ChatService = Depends(get_chat_service)):
    return service.get_latest_messages(thread_id)
