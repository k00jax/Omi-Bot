import { storage } from './storage';
import { HotPhrase, Memory } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Lightweight real-time processor that does not alter existing hotPhraseEngine logic.
export function processLiveTranscript(text: string): Memory[] {
  const phrases: HotPhrase[] = storage.getHotPhrases().filter(p => p.enabled);
  const created: Memory[] = [];

  phrases.forEach(phrase => {
    const idx = text.toLowerCase().indexOf(phrase.phrase.toLowerCase());
    if (idx !== -1) {
      const content = text.slice(idx + phrase.phrase.length).trim();
      if (!content) return;
      const memory: Memory = {
        id: uuidv4(),
        content,
        timestamp: new Date().toISOString(),
        type: phrase.type,
        tags: [phrase.type, 'live'],
        hotPhrase: phrase.phrase
      } as Memory;
      storage.saveMemory(memory);
      created.push(memory);
    }
  });

  return created;
}
