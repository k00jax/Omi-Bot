
from hotphrases.actions import trigger_action

HOT_PHRASES = {
    "note this": "create_note",
    "remember this": "save_memory",
    "look into": "add_research"
}

def process_transcript(transcript: str):
    for phrase, action in HOT_PHRASES.items():
        if phrase in transcript.lower():
            print(f"🔥 Hot phrase detected: {phrase}")
            trigger_action(action, transcript)
            return
