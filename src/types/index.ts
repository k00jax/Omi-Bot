export interface Memory {
  id: string;
  content: string;
  timestamp: string;
  tags: string[];
  type: 'note' | 'research' | 'reminder' | 'general';
  hotPhrase?: string;
  // Indicates memory was produced by the real-time live stream pipeline
  liveSource?: boolean;
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
  // For live stream entries that are raw/unprocessed
  live?: boolean;
}

export interface AppStats {
  totalMemories: number;
  totalTranscripts: number;
  hotPhrasesTriggered: number;
  lastActivity: string;
}