import React, { useEffect, useState, useRef } from 'react';
import { processLiveTranscript } from '../utils/hotPhraseEngine';
import { storage } from '../utils/storage';
import { Zap } from 'lucide-react';
import { TranscriptEntry } from '../types';

interface TranscriptLiveViewProps {
  onMemoryCreated: (count: number) => void;
}

export const TranscriptLiveView: React.FC<TranscriptLiveViewProps> = ({ onMemoryCreated }) => {
  const [liveLine, setLiveLine] = useState('');
  const [wsStatus, setWsStatus] = useState<'idle' | 'connecting' | 'open' | 'error'>('idle');
  const [memoriesFromLive, setMemoriesFromLive] = useState(0);
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setEntries(storage.getTranscripts());
  }, []);

  useEffect(() => {
    const url = (import.meta as any).env?.VITE_TRANSCRIPT_URL as string | undefined;
    if (!url) return;
    setWsStatus('connecting');
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setWsStatus('open');
    ws.onerror = () => setWsStatus('error');
    ws.onclose = () => setWsStatus(prev => (prev === 'error' ? 'error' : 'idle'));
    ws.onmessage = (e) => {
      const text = typeof e.data === 'string' ? e.data : '';
      if (!text) return;
      setLiveLine(text);
      // Save raw transcript entry quickly
      const entry: TranscriptEntry = {
        id: `live-${Date.now()}`,
        text,
        timestamp: new Date().toISOString(),
        processed: false,
        matchedPhrases: []
      };
      storage.saveTranscript(entry);
      setEntries(prev => [entry, ...prev].slice(0, 100));
      const created = processLiveTranscript(text);
      if (created.length) {
        setMemoriesFromLive(m => m + created.length);
        onMemoryCreated(created.length);
      }
    };

    return () => ws.close();
  }, [onMemoryCreated]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Stream</h2>
        <div className="text-xs mb-4">
          <span className={
            wsStatus === 'open' ? 'text-green-600' : wsStatus === 'connecting' ? 'text-blue-600' : 'text-red-600'
          }>
            WebSocket: {wsStatus}
          </span>
        </div>
        <div className="bg-black text-green-400 font-mono p-4 rounded h-32 overflow-auto text-sm whitespace-pre-wrap">{liveLine || 'Waiting for data...'}</div>
        <div className="mt-3 text-sm text-green-700 flex items-center gap-1">
          <Zap className="w-4 h-4" /> {memoriesFromLive} memories created from stream
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Recent Raw Entries</h3>
        {entries.length === 0 ? (
          <div className="text-gray-500 text-sm">No entries yet.</div>
        ) : (
          <ul className="space-y-2 text-sm">
            {entries.slice(0, 25).map(e => (
              <li key={e.id} className="bg-white border border-gray-200 rounded p-2 flex justify-between">
                <span className="text-gray-800 truncate pr-4">{e.text}</span>
                <span className="text-gray-400 min-w-[90px] text-right">{new Date(e.timestamp).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
