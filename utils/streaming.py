"""
Streaming utilities for real-time response display.
Handles different types of streaming output for better user experience.
"""

from typing import Any
from langchain.schema import BaseMessage, PromptValue, AIMessage
from langchain.schema.runnable import Runnable
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
