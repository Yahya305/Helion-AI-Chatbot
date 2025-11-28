"""
Graph construction and compilation for Helion.
Defines the workflow structure and compiles the LangGraph.
"""
from core.database import get_psycopg_db_connection
from langgraph.graph import StateGraph, START, END

from .state import AgentState
from .nodes import agent_node, agent_node_with_streaming, tool_node, decide_next_step
from psycopg import Connection
from psycopg.rows import dict_row
from langgraph.checkpoint.postgres import PostgresSaver

def create_agent_workflow():
    """
    Create and compile the agent workflow graph.
    
    Args:
        db_connection: PostgreSQL database connection for checkpointing
        
    Returns:
        Compiled LangGraph application
    """
    use_streaming = True
    
    # Create the workflow
    workflow = StateGraph(AgentState)
    
    # Choose which agent node to use based on streaming preference
    if use_streaming:
        workflow.add_node("agent", agent_node_with_streaming)
        print("Using streaming agent node")
    else:
        workflow.add_node("agent", agent_node)
        print("Using standard agent node")
    
    # Add tool node
    workflow.add_node("tool_node", tool_node)
    
    # Define the workflow edges
    workflow.add_edge(START, "agent")
    
    # Add conditional edges from agent
    workflow.add_conditional_edges(
        "agent",
        decide_next_step,
        {
            "tool_node": "tool_node",
            "respond_and_end": END
        }
    )
    
    # Tool node always goes back to agent
    workflow.add_edge("tool_node", "agent")
    
    # Create the checkpointer with a connection pool
    # This ensures we always get a fresh connection and avoid "connection closed" errors
    from psycopg_pool import ConnectionPool
    from core import constants
    
    pool = ConnectionPool(
        conninfo=constants.POSTGRES_CONNECTION_URI,
        max_size=20,
        kwargs={
            "autocommit": True,
            "prepare_threshold": 0,
            "row_factory": dict_row
        }
    )
    checkpointer = PostgresSaver(pool)
    
    # Setup the database tables
    try:
        checkpointer.setup()
    except Exception as e:
        # Ignore DuplicateColumn error if it's already set up
        if "DuplicateColumn" in str(e) or "already exists" in str(e):
            print(f"Database setup warning (safe to ignore): {e}")
        else:
            print(f"Database setup error: {e}")
    
    # Compile the workflow with checkpointing
    app = workflow.compile(checkpointer=checkpointer)
    
    print("Agent workflow compiled successfully!")
    return app

def get_workflow_visualization(app):
    """
    Get a visualization of the workflow graph (if mermaid is available).
    
    Args:
        app: Compiled LangGraph application
        
    Returns:
        Mermaid diagram string or None if not available
    """
    try:
        return app.get_graph().draw_mermaid()
    except Exception as e:
        print(f"Could not generate workflow visualization: {e}")
        return None