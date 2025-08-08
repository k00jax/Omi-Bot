
import os
from dotenv import load_dotenv

def load_config():
    load_dotenv()
    return {
        "OMI_TRANSCRIPT_PATH": os.getenv("OMI_TRANSCRIPT_PATH", "/transcript"),
        "OMI_MEMORY_PATH": os.getenv("OMI_MEMORY_PATH", "/conversation_event"),
        "PORT": os.getenv("PORT", "5001"),
        "OMI_API_KEY": os.getenv("OMI_API_KEY"),
        "USE_MCP": os.getenv("USE_MCP", "False") == "True",
        "DEBUG": os.getenv("DEBUG", "False") == "True"
    }
