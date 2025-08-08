import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Zap } from 'lucide-react';
import { TranscriptEntry } from '../types';
import { storage } from '../utils/storage';
import { hotPhraseEngine } from '../utils/hotPhrase';

interface TranscriptViewProps {
  onMemoryCreated: () => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ onMemoryCreated }) => {
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTranscripts(storage.getTranscripts());
  }, []);

  const simulateTranscript = () => {
    const sampleTexts = [
      "note this: buy almond milk and organic vegetables for dinner",
      "remember this: meeting with Sarah tomorrow at 3pm about the project proposal",
      "look into: latest React 18 features and concurrent rendering capabilities",
      "remind me to call the dentist next week for regular checkup",
      "The weather today is perfect for a walk in the park",
      "note this: great restaurant recommendation - Luigi's Italian on 5th street",
      "look into: investing in renewable energy stocks for portfolio diversification"
    ];
    
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setCurrentTranscript(randomText);
    
    // Auto-process after a delay
    setTimeout(() => {
      processTranscript(randomText);
    }, 1500);
  };

  const processTranscript = (text: string = currentTranscript) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const { matchedPhrases, memories } = hotPhraseEngine.processTranscript(text);
      
      const transcriptEntry: TranscriptEntry = {
        id: `transcript-${Date.now()}`,
        text,
        timestamp: new Date().toISOString(),
        processed: true,
        matchedPhrases
      };

      storage.saveTranscript(transcriptEntry);
      setTranscripts(prev => [transcriptEntry, ...prev]);
      setCurrentTranscript('');
      setIsProcessing(false);
      
      if (memories.length > 0) {
        onMemoryCreated();
      }
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Transcript Processing</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Current Transcript</span>
            <div className="flex space-x-2">
              <button
                onClick={simulateTranscript}
                disabled={isProcessing}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <Mic className="w-3 h-3" />
                <span>Simulate</span>
              </button>
              <button
                onClick={() => processTranscript()}
                disabled={!currentTranscript.trim() || isProcessing}
                className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>Process</span>
              </button>
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            value={currentTranscript}
            onChange={(e) => setCurrentTranscript(e.target.value)}
            placeholder="Type or simulate a transcript..."
            className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          {isProcessing && (
            <div className="mt-3 flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-sm">Processing transcript...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transcripts</h3>
        
        {transcripts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Mic className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No transcripts yet. Start speaking or simulate some input!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transcripts.map((transcript) => (
              <div
                key={transcript.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-gray-500">{formatTime(transcript.timestamp)}</span>
                  {transcript.matchedPhrases.length > 0 && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Zap className="w-3 h-3" />
                      <span className="text-xs">Triggers: {transcript.matchedPhrases.length}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-800 mb-3">{transcript.text}</p>
                
                {transcript.matchedPhrases.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {transcript.matchedPhrases.map((phrase, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};