import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TranscriptView } from './components/TranscriptView';
import { TranscriptLiveView } from './components/TranscriptLiveView';
import { MemoriesView } from './components/MemoriesView';
import { HotPhrasesView } from './components/HotPhrasesView';
import { SearchView } from './components/SearchView';
import { storage } from './utils/storage';
import { AppStats } from './types';

function App() {
  const [activeView, setActiveView] = useState('transcript');
  const [stats, setStats] = useState<AppStats>({
    totalMemories: 0,
    totalTranscripts: 0,
    hotPhrasesTriggered: 0,
    lastActivity: ''
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    updateStats();
  }, [refreshTrigger]);

  const updateStats = () => {
    const memories = storage.getMemories();
    const transcripts = storage.getTranscripts();
    const hotPhrasesTriggered = transcripts.reduce((acc, t) => acc + t.matchedPhrases.length, 0);
    
    setStats({
      totalMemories: memories.length,
      totalTranscripts: transcripts.length,
      hotPhrasesTriggered,
      lastActivity: memories.length > 0 ? memories[0].timestamp : ''
    });
  };

  const handleMemoryCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'transcript':
        return <TranscriptView onMemoryCreated={handleMemoryCreated} />;
      case 'live':
        return <TranscriptLiveView onMemoryCreated={() => handleMemoryCreated()} />;
      case 'memories':
        return <MemoriesView refreshTrigger={refreshTrigger} />;
      case 'hotphrases':
        return <HotPhrasesView />;
      case 'search':
        return <SearchView />;
      default:
        return <TranscriptView onMemoryCreated={handleMemoryCreated} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header stats={stats} />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 overflow-hidden">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default App;