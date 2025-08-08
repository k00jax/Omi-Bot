import React, { useState, useEffect } from 'react';
import { BookOpen, Tag, Trash2, Calendar, Search } from 'lucide-react';
import { Memory } from '../types';
import { storage } from '../utils/storage';

interface MemoriesViewProps {
  refreshTrigger: number;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({ refreshTrigger }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    setMemories(storage.getMemories());
  }, [refreshTrigger]);

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || memory.type === selectedType;
    return matchesSearch && matchesType;
  });

  const deleteMemory = (id: string) => {
    storage.deleteMemory(id);
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note': return 'bg-blue-100 text-blue-700';
      case 'research': return 'bg-purple-100 text-purple-700';
      case 'reminder': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Memory Vault</h2>
          <span className="text-sm text-gray-500">{filteredMemories.length} memories</span>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="note">Notes</option>
            <option value="research">Research</option>
            <option value="reminder">Reminders</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>{searchTerm || selectedType !== 'all' ? 'No memories match your filters' : 'No memories stored yet'}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(memory.type)}`}>
                      {memory.type}
                    </span>
                    {memory.hotPhrase && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Triggered by: "{memory.hotPhrase}"
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => deleteMemory(memory.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-gray-800 mb-4 leading-relaxed">{memory.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{formatDate(memory.timestamp)}</span>
                  </div>
                  
                  {memory.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <div className="flex space-x-1">
                        {memory.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {memory.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{memory.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};