import React from 'react';
import { Brain, Activity } from 'lucide-react';

interface HeaderProps {
  stats: {
    totalMemories: number;
    totalTranscripts: number;
    hotPhrasesTriggered: number;
  };
}

export const Header: React.FC<HeaderProps> = ({ stats }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Omi-Bot</h1>
            <p className="text-sm text-gray-500">AI Memory & Transcript Processing</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </div>
          
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{stats.totalMemories}</div>
              <div className="text-xs text-gray-500">Memories</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.totalTranscripts}</div>
              <div className="text-xs text-gray-500">Transcripts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.hotPhrasesTriggered}</div>
              <div className="text-xs text-gray-500">Triggers</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};