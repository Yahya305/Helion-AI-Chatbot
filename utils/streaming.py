"""
Streaming utilities for real-time response display.
Handles different types of streaming output for better user experience.
"""

import time
from typing import Optional, Iterator, Any, Callable
from config.settings import get_streaming_config
from langchain.schema import BaseMessage, PromptValue, AIMessage
from langchain.schema.runnable import Runnable
from utils.logger import logger
from typing import Sequence, Any
from utils.response_extractor import extract_final_answer


def stream_response(llm_with_tools:Runnable[PromptValue | str | Sequence[BaseMessage | list[str] | tuple[str, str] | str | dict[str, Any]], BaseMessage], formatted_prompt) -> None:
    found_final_answer = False
    buffer = ""
    streamed_content = ""
    for chunk in llm_with_tools.stream(formatted_prompt):
        if chunk.content:
            # print(chunk.content, end='', flush=True)
            streamed_content += chunk.content
            buffer += chunk.content
            # Check if we've hit "Final Answer:" and haven't started streaming yet
            if not found_final_answer and "Final Answer:" in buffer:
                found_final_answer = True
                # Find the position after "Final Answer:"
                final_answer_pos = buffer.find("Final Answer:") + len("Final Answer:")
                # Get content after "Final Answer:" and stream it
                after_final_answer = buffer[final_answer_pos:].strip()
                if after_final_answer:
                    print(after_final_answer, end='', flush=True)
                    # ai_message = AIMessage(content=after_final_answer)
            
            # If we're already streaming, display new tokens
            elif found_final_answer:
                print(chunk.content, end='', flush=True)

    if found_final_answer:
        clean_answer = extract_final_answer(streamed_content)
        ai_message = AIMessage(content=clean_answer, name="agent")
        return ai_message
    else:
        return AIMessage(content=streamed_content, name="agent")


def _stream_by_character(content: str, delay: float) -> None:
    """Stream content character by character."""
    for char in content:
        print(char, end='', flush=True)
        time.sleep(delay)


def stream_with_typing_effect(content: str, wpm: int = 200) -> None:
    """
    Stream content with a typing effect based on words per minute.
    
    Args:
        content: Text content to stream
        wpm: Words per minute typing speed
    """
    words = content.split()
    delay_per_word = 60.0 / wpm  # Convert WPM to delay between words
    
    for i, word in enumerate(words):
        print(word, end='', flush=True)
        if i < len(words) - 1:
            print(' ', end='', flush=True)
        time.sleep(delay_per_word)


def stream_with_highlights(content: str, highlights: list, delay: float = 0.03) -> None:
    """
    Stream content with specific words/phrases highlighted.
    
    Args:
        content: Text content to stream
        highlights: List of words/phrases to highlight
        delay: Delay between words
    """
    words = content.split()
    
    for word in words:
        # Check if word should be highlighted
        should_highlight = any(highlight.lower() in word.lower() for highlight in highlights)
        
        if should_highlight:
            # Use ANSI codes for highlighting (yellow background)
            print(f'\033[43m{word}\033[0m', end=' ', flush=True)
        else:
            print(word, end=' ', flush=True)
        
        time.sleep(delay)


def simulate_thinking_delay(min_seconds: float = 0.5, max_seconds: float = 2.0) -> None:
    """
    Simulate thinking/processing time with a visual indicator.
    
    Args:
        min_seconds: Minimum thinking time
        max_seconds: Maximum thinking time
    """
    import random
    
    thinking_time = random.uniform(min_seconds, max_seconds)
    dots = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    
    start_time = time.time()
    dot_index = 0
    
    print("Thinking ", end='', flush=True)
    
    while time.time() - start_time < thinking_time:
        print(f'\r{dots[dot_index % len(dots)]} Thinking...', end='', flush=True)
        dot_index += 1
        time.sleep(0.1)
    
    print('\r' + ' ' * 20 + '\r', end='', flush=True)  # Clear the thinking indicator


def stream_error_message(error: str, delay: float = 0.05) -> None:
    """
    Stream error messages with appropriate formatting.
    
    Args:
        error: Error message to stream
        delay: Delay between characters
    """
    # Use ANSI codes for red text
    error_formatted = f'\033[31mError: {error}\033[0m'
    _stream_by_character(error_formatted, delay)
    print()  # New line after error


def stream_system_message(message: str, delay: float = 0.02) -> None:
    """
    Stream system messages with appropriate formatting.
    
    Args:
        message: System message to stream
        delay: Delay between characters
    """
    # Use ANSI codes for blue text
    system_formatted = f'\033[34m[System]: {message}\033[0m'
    _stream_by_character(system_formatted, delay)
    print()  # New line after message


def get_streaming_stats() -> dict:
    """
    Get statistics about streaming performance.
    
    Returns:
        dict: Streaming statistics
    """
    config = get_streaming_config()
    
    return {
        "enabled": config.get("enabled", True),
        "method": config.get("method", "word"),
        "delay": config.get("delay", 0.03),
        "supported_methods": ["char", "word", "sentence"],
        "features": [
            "progress_indicator",
            "typing_effect", 
            "json_streaming",
            "highlighting",
            "thinking_simulation"
        ]
    }