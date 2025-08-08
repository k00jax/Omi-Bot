import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Tag } from 'lucide-react';
import { Memory } from '../types';
import { storage } from '../utils/storage';

export const SearchView: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const allMemories = storage.getMemories();
    setMemories(allMemories);
    
    // Extract all unique tags
    const tags = Array.from(new Set(allMemories.flatMap(m => m.tags))).sort();
    setAllTags(tags);
  }, []);

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = searchTerm === '' || 
      memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => memory.tags.includes(tag));
    
    const matchesDate = (!dateRange.start && !dateRange.end) ||
      (dateRange.start && new Date(memory.timestamp) >= new Date(dateRange.start)) &&
      (dateRange.end && new Date(memory.timestamp) <= new Date(dateRange.end));
    
    return matchesSearch && matchesTags && matchesDate;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setDateRange({ start: '', end: '' });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note': return 'bg-blue-100 text-blue-700';
      case 'research': return 'bg-purple-100 text-purple-700';
      case 'reminder': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Search</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Date Range */}
          <div className="flex items-center space-x-4">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags Filter */}
          <div className="flex items-start space-x-4">
            <Tag className="w-4 h-4 text-gray-400 mt-1" />
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-100 text-purple-700 border-purple-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedTags.length > 0 || dateRange.start || dateRange.end) && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <Filter className="w-3 h-3" />
              <span>Clear all filters</span>
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-500">
          Found {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No memories match your search criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(memory.type)}`}>
                      {memory.type}
                    </span>
                    {memory.hotPhrase && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        "{memory.hotPhrase}"
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(memory.timestamp)}</span>
                </div>
                
                <p className="text-gray-800 mb-3 leading-relaxed">{memory.content}</p>
                
                {memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {memory.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
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