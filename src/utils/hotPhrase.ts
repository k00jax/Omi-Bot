import { HotPhrase, Memory, TranscriptEntry } from '../types';
import { storage } from './storage';

export const hotPhraseEngine = {
  processTranscript(transcript: string): { 
    matchedPhrases: string[], 
    memories: Memory[] 
  } {
    const hotPhrases = storage.getHotPhrases().filter(p => p.enabled);
    const matchedPhrases: string[] = [];
    const memories: Memory[] = [];

    hotPhrases.forEach(phrase => {
      if (transcript.toLowerCase().includes(phrase.phrase.toLowerCase())) {
        matchedPhrases.push(phrase.phrase);
        
        const memory = this.executeAction(phrase, transcript);
        if (memory) {
          memories.push(memory);
          storage.saveMemory(memory);
        }
      }
    });

    return { matchedPhrases, memories };
  },

  executeAction(phrase: HotPhrase, transcript: string): Memory | null {
    const now = new Date().toISOString();
    const id = `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Extract content after the hot phrase
    const phraseIndex = transcript.toLowerCase().indexOf(phrase.phrase.toLowerCase());
    const content = transcript.substring(phraseIndex + phrase.phrase.length).trim();

    if (!content) return null;

    const baseMemory = {
      id,
      content,
      timestamp: now,
      hotPhrase: phrase.phrase,
      tags: [phrase.type]
    };

    switch (phrase.action) {
      case 'create_note':
        return {
          ...baseMemory,
          type: 'note' as const,
          tags: [...baseMemory.tags, 'quick-note']
        };
      
      case 'create_memory':
        return {
          ...baseMemory,
          type: 'general' as const,
          tags: [...baseMemory.tags, 'important']
        };
      
      case 'add_research':
        return {
          ...baseMemory,
          type: 'research' as const,
          tags: [...baseMemory.tags, 'research', 'todo']
        };
      
      case 'create_reminder':
        return {
          ...baseMemory,
          type: 'reminder' as const,
          tags: [...baseMemory.tags, 'reminder', 'action-item']
        };
      
      default:
        return {
          ...baseMemory,
          type: 'general' as const
        };
    }
  }
};