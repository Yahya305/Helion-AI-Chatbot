from utils.logger import logger
from tools import register_default_tools
from agent.workflow import create_agent_workflow
from psycopg import Connection as PGConnection
from fastapi.responses import StreamingResponse
from utils.conversation import stream_interaction



class Agent:
    def __init__(self, db_conn: PGConnection):
        """Initialize the agent with configuration and workflow."""
        logger.info("Initializing Agent...")
  
        
        # Initialize database
        self.db_connection = db_conn

        # Setup and Load tools
        register_default_tools()
        
        # Create the agent workflow
        self.app = create_agent_workflow(self.db_connection)

    def invoke(self, user_input: str, thread_id: str, user_id: str):
        """
        Return a StreamingResponse so FastAPI can stream back to the client.
        """
        return StreamingResponse(
            stream_interaction(user_input, thread_id, user_id, self.app),
            media_type="text/plain"
        )
