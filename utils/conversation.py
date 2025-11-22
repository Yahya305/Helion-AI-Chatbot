"""
Conversation history and display functions.
Manages conversation threading, history display, and interaction handling.
"""
from typing import Optional, List, Dict, Any
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langgraph.graph.state import CompiledStateGraph
from typing import Generator
from agent.state import AgentState
from .logger import logger


def display_conversation_history(thread_id: str, app) -> bool:
    """
    Display existing conversation history for a thread.
    
    Args:
        thread_id: Thread identifier to retrieve history for
        app: Compiled LangGraph application
        
    Returns:
        bool: True if history exists and was displayed, False otherwise
    """
    try:
        # Get state from the compiled graph
        state = app.get_state(config={"configurable": {"thread_id": thread_id}})
        
        if state and state.values and "messages" in state.values:
            messages = state.values["messages"]
            
            if messages:
                logger.info("\n--- Conversation History for Thread: {} ---", thread_id)
                display_messages(messages)
                logger.info("--- End of History ---\n")
                return True
            else:
                logger.info("No conversation history found for thread: {}", thread_id)
                return False
        else:
            logger.info("No conversation history found for thread: {}", thread_id)
            return False
            
    except Exception as e:
        logger.debug("Error retrieving conversation history: {}", e)
        return False


def display_messages(messages: List[BaseMessage]) -> None:
    """
    Display a list of messages in a formatted way.
    
    Args:
        messages: List of conversation messages to display
    """
    for i, message in enumerate(messages, 1):
        if isinstance(message, HumanMessage):
            logger.info("{}. User: {}", i, message.content)
        elif isinstance(message, AIMessage):
            logger.info("{}. Agent: {}", i, message.content)
        elif isinstance(message, ToolMessage):
            truncated_content = message.content[:200] + ('...' if len(message.content) > 200 else '')
            logger.info("{}. Tool Output: {}", i, truncated_content)


def get_conversation_summary(messages: List[BaseMessage]) -> Dict[str, Any]:
    """
    Generate a summary of the conversation.
    
    Args:
        messages: List of conversation messages
        
    Returns:
        dict: Conversation summary with statistics
    """
    summary = {
        "total_messages": len(messages),
        "user_messages": 0,
        "agent_messages": 0,
        "tool_messages": 0,
        "first_message_time": None,
        "last_message_time": None,
        "topics_mentioned": []
    }
    
    for message in messages:
        if isinstance(message, HumanMessage):
            summary["user_messages"] += 1
        elif isinstance(message, AIMessage):
            summary["agent_messages"] += 1
        elif isinstance(message, ToolMessage):
            summary["tool_messages"] += 1
    
    return summary


from langchain_core.messages import AIMessageChunk

def stream_interaction(
    user_input: str,
    thread_id: str,
    user_id: str,
    app: CompiledStateGraph[AgentState, None, AgentState, AgentState]
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
        stream_gen = app.stream(
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


def run_single_interaction(user_input: str, thread_id: str, user_id:str, app: CompiledStateGraph[AgentState, None, AgentState, AgentState]) -> bool:
    """
    Run a single interaction with the agent.
    
    Args:
        user_input: User's message/question
        thread_id: Thread identifier for conversation continuity
        app: Compiled LangGraph application
        
    Returns:
        bool: True if interaction was successful, False otherwise
    """
    logger.debug("\n--- User: {} ---", user_input)
    
    # Create initial message and state
    initial_message = HumanMessage(content=user_input)
    initial_state: AgentState = {
        "messages": [initial_message], 
        "next_action": "respond",
        "actions": []
    }
    
    final_response_streamed = False
    
    logger.debug("==========================",initial_state)
    try:
        # Stream the interaction
        for step in app.stream(
            input=initial_state,
            context={"user_id": user_id},
            config={"configurable": {"thread_id": thread_id},"metadata":{"user_id":user_id}},
        ):
            if "__end__" not in step:
                for node_name, node_output in step.items():
                    # Handle different node outputs
                    if node_name == "agent" and "messages" in node_output:
                        if node_output.get("next_action") == "respond":
                            # This is the final response
                            last_msg = node_output["messages"][-1] if node_output["messages"] else None
                            if last_msg and isinstance(last_msg, AIMessage) and not final_response_streamed:
                                # logger.info("Agent: ", end='', flush=True)
                                final_response_streamed = True
                                logger.info("")  # New line after response
                        elif node_output.get("next_action") == "call_tool":
                            # Show tool usage indicator
                            logger.debug("Agent: [Using tools to help you...]")
                    
                    elif node_name == "tool_node":
                        # Tool execution feedback
                        logger.debug("[Tools executed, processing results...]")
                        
        
        if not final_response_streamed:
            logger.info("Agent: I apologize, but I couldn't generate a response. Please try again.")
        
        return True
        
    except Exception as e:
        logger.debug("\nAn error occurred during interaction: {}", e)
        return False

