
from flask import jsonify
from hotphrases.engine import process_transcript

def handle_transcript(req):
    data = req.get_json()
    transcript = data.get("transcript", "")
    print("📥 Transcript received:", transcript)
    process_transcript(transcript)
    return jsonify({"status": "received"}), 200
