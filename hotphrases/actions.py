
from memories.store import save_memory

def trigger_action(action, transcript):
    if action == "create_note":
        print("📝 Creating note:", transcript)
        save_memory(transcript)
    elif action == "add_research":
        print("🔍 Tagging research topic:", transcript)
        save_memory(transcript, tags="research")
