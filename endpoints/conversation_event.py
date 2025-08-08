
from flask import jsonify
from memories.store import save_memory

def handle_conversation_event(req):
    data = req.get_json()
    content = data.get("content", "")
    tags = ", ".join(data.get("tags", []))
    print("🧠 Conversation event received:", content)
    save_memory(content, tags)
    return jsonify({"status": "stored"}), 200
