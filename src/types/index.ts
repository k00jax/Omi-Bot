export interface Memory {
  id: string;
  content: string;
  timestamp: string;
  tags: string[];
  type: 'note' | 'research' | 'reminder' | 'general';
  hotPhrase?: string;
}

export interface HotPhrase {
  id: string;
  phrase: string;
  action: string;
  type: 'note' | 'research' | 'reminder';
  enabled: boolean;
}

export interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: string;
  processed: boolean;
  matchedPhrases: string[];
}

export interface AppStats {
  totalMemories: number;
  totalTranscripts: number;
  hotPhrasesTriggered: number;
  lastActivity: string;
}