
import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join("data", "memories.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY,
            content TEXT,
            timestamp TEXT,
            tags TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_memory(content, tags=""):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO memories (content, timestamp, tags)
        VALUES (?, ?, ?)
    """, (content, datetime.utcnow().isoformat(), tags))
    conn.commit()
    conn.close()

init_db()
