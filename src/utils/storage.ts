import { Memory, HotPhrase, TranscriptEntry } from '../types';

const STORAGE_KEYS = {
  MEMORIES: 'omi-bot-memories',
  HOT_PHRASES: 'omi-bot-hot-phrases',
  TRANSCRIPTS: 'omi-bot-transcripts',
} as const;

export const storage = {
  // Memory operations
  getMemories(): Memory[] {
    const stored = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    return stored ? JSON.parse(stored) : [];
  },

  saveMemory(memory: Memory): void {
    const memories = this.getMemories();
    memories.push(memory);
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  },

  deleteMemory(id: string): void {
    const memories = this.getMemories().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  },

  // Hot phrase operations
  getHotPhrases(): HotPhrase[] {
    const stored = localStorage.getItem(STORAGE_KEYS.HOT_PHRASES);
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        phrase: 'note this',
        action: 'create_note',
        type: 'note',
        enabled: true
      },
      {
        id: '2',
        phrase: 'remember this',
        action: 'create_memory',
        type: 'note',
        enabled: true
      },
      {
        id: '3',
        phrase: 'look into',
        action: 'add_research',
        type: 'research',
        enabled: true
      },
      {
        id: '4',
        phrase: 'remind me',
        action: 'create_reminder',
        type: 'reminder',
        enabled: true
      }
    ];
  },

  saveHotPhrase(phrase: HotPhrase): void {
    const phrases = this.getHotPhrases();
    const existingIndex = phrases.findIndex(p => p.id === phrase.id);
    
    if (existingIndex >= 0) {
      phrases[existingIndex] = phrase;
    } else {
      phrases.push(phrase);
    }
    
    localStorage.setItem(STORAGE_KEYS.HOT_PHRASES, JSON.stringify(phrases));
  },

  deleteHotPhrase(id: string): void {
    const phrases = this.getHotPhrases().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.HOT_PHRASES, JSON.stringify(phrases));
  },

  // Transcript operations
  getTranscripts(): TranscriptEntry[] {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS);
    return stored ? JSON.parse(stored) : [];
  },

  saveTranscript(transcript: TranscriptEntry): void {
    const transcripts = this.getTranscripts();
    transcripts.unshift(transcript); // Add to beginning
    
    // Keep only last 100 transcripts
    if (transcripts.length > 100) {
      transcripts.splice(100);
    }
    
    localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(transcripts));
  }
};