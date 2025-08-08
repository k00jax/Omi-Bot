
from flask import Flask, request
from config.settings import load_config
from endpoints.real_time import handle_transcript
from endpoints.conversation_event import handle_conversation_event

config = load_config()
app = Flask(__name__)

@app.route(config["OMI_TRANSCRIPT_PATH"], methods=["POST"])
def transcript_endpoint():
    return handle_transcript(request)

@app.route(config["OMI_MEMORY_PATH"], methods=["POST"])
def memory_endpoint():
    return handle_conversation_event(request)

if __name__ == "__main__":
    app.run(port=int(config["PORT"]), debug=config["DEBUG"])
