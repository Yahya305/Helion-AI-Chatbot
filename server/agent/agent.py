from utils.logger import logger
from tools import register_default_tools
from .workflow import create_agent_workflow
from .state import AgentState
from psycopg import Connection as PGConnection
from fastapi.responses import StreamingResponse
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langchain_core.messages import AIMessageChunk
from typing import Generator



class Agent:
    def __init__(self):
        """Initialize the agent with configuration and workflow."""
        logger.info("Initializing Agent...")
  
        
        # # Initialize database
        # self.db_connection = db_conn

        # Setup and Load tools
        register_default_tools()
        
        # Create the agent workflow
        self.app = create_agent_workflow()

    def invoke(self, user_input: str, thread_id: str, user_id: str):
        """
        Return a StreamingResponse so FastAPI can stream back to the client.
        """
        return StreamingResponse(
            self._stream_interaction(user_input, thread_id, user_id),
            media_type="text/plain"
        )

    def _stream_interaction(
        self,
        user_input: str,
        thread_id: str,
        user_id: str
    ) -> Generator[str, None, None]:
        """
        Stream an interaction with the agent, yielding token-by-token chunks.
        """
        logger.debug(f"\n--- User input: {user_input} ---")

        initial_message = HumanMessage(content=user_input, name="user")
        initial_state = {
            "messages": [initial_message],
            "next_action": "respond",
            "actions": []
        }

        try:
            stream_gen = self.app.stream(
                input=initial_state,
                context={"user_id": user_id},
                config={
                    "configurable": {"thread_id": thread_id},
                    "metadata": {"user_id": user_id},
                },
                stream_mode="messages",  # 🔥 this gives AIMessageChunk
            )

            for step in stream_gen:
                logger.debug(f"[Step received]: {step}")

                # step[0] is usually the chunk
                chunk = step[0]
                if isinstance(chunk, AIMessageChunk):
                    if chunk.content:  # only yield if there's new text
                        yield chunk.content

            yield "[END]\n"

        except Exception as e:
            logger.debug(f"❌ Error during interaction: {repr(e)}")
            yield f"[ERROR]: {str(e)}\n"

    def display_conversation_history(self, thread_id: str) -> bool:
        """
        Display existing conversation history for a thread.

        Args:
            thread_id: Thread identifier to retrieve history for

        Returns:
            bool: True if history exists and was displayed, False otherwise
        """
        try:
            # Get state from the compiled graph
            state = self.app.get_state(config={"configurable": {"thread_id": thread_id}})
            
            if not (state and state.values and "messages" in state.values):
                logger.info("No conversation history found for thread: {}", thread_id)
                return False

            messages = state.values["messages"]
            if not messages:
                logger.info("No conversation history found for thread: {}", thread_id)
                return False

            logger.info("\n--- Conversation History for Thread: {} ---", thread_id)

            # Inline message-display logic
            for i, message in enumerate(messages, 1):
                if isinstance(message, HumanMessage):
                    logger.info("{}. User: {}", i, message.content)
                elif isinstance(message, AIMessage):
                    logger.info("{}. Agent: {}", i, message.content)
                elif isinstance(message, ToolMessage):
                    truncated = (
                        message.content[:200] + "..."
                        if len(message.content) > 200
                        else message.content
                    )
                    logger.info("{}. Tool Output: {}", i, truncated)

            logger.info("--- End of History ---\n")
            return True

        except Exception as e:
            logger.debug("Error retrieving conversation history: {}", e)
            return False

