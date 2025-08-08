import React, { useState, useEffect } from 'react';
import { Zap, Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { HotPhrase } from '../types';
import { storage } from '../utils/storage';

export const HotPhrasesView: React.FC = () => {
  const [hotPhrases, setHotPhrases] = useState<HotPhrase[]>([]);
  const [editingPhrase, setEditingPhrase] = useState<HotPhrase | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    setHotPhrases(storage.getHotPhrases());
  }, []);

  const togglePhrase = (id: string) => {
    const updated = hotPhrases.map(phrase => 
      phrase.id === id ? { ...phrase, enabled: !phrase.enabled } : phrase
    );
    setHotPhrases(updated);
    
    const phrase = updated.find(p => p.id === id);
    if (phrase) {
      storage.saveHotPhrase(phrase);
    }
  };

  const deletePhrase = (id: string) => {
    storage.deleteHotPhrase(id);
    setHotPhrases(prev => prev.filter(p => p.id !== id));
  };

  const savePhrase = (phrase: HotPhrase) => {
    storage.saveHotPhrase(phrase);
    setHotPhrases(prev => {
      const existing = prev.find(p => p.id === phrase.id);
      if (existing) {
        return prev.map(p => p.id === phrase.id ? phrase : p);
      }
      return [...prev, phrase];
    });
    setEditingPhrase(null);
    setIsAddingNew(false);
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Hot Phrases</h2>
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Phrase</span>
          </button>
        </div>
        <p className="text-gray-600">Configure phrases that trigger automatic memory creation</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {(isAddingNew || editingPhrase) && (
          <HotPhraseEditor
            phrase={editingPhrase || {
              id: `phrase-${Date.now()}`,
              phrase: '',
              action: '',
              type: 'note',
              enabled: true
            }}
            onSave={savePhrase}
            onCancel={() => {
              setEditingPhrase(null);
              setIsAddingNew(false);
            }}
          />
        )}

        <div className="grid gap-4">
          {hotPhrases.map((phrase) => (
            <div
              key={phrase.id}
              className={`bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
                phrase.enabled ? 'hover:shadow-md' : 'opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => togglePhrase(phrase.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {phrase.enabled ? (
                      <ToggleRight className="w-6 h-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(phrase.type)}`}>
                    {phrase.type}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingPhrase(phrase)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePhrase(phrase.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-2">
                <span className="font-medium text-purple-700">"{phrase.phrase}"</span>
                <span className="text-gray-500 mx-2">→</span>
                <span className="text-sm text-gray-600">{phrase.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HotPhraseEditor: React.FC<{
  phrase: HotPhrase;
  onSave: (phrase: HotPhrase) => void;
  onCancel: () => void;
}> = ({ phrase, onSave, onCancel }) => {
  const [formData, setFormData] = useState(phrase);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">
        {phrase.phrase ? 'Edit Hot Phrase' : 'New Hot Phrase'}
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phrase
          </label>
          <input
            type="text"
            value={formData.phrase}
            onChange={(e) => setFormData({ ...formData, phrase: e.target.value })}
            placeholder="e.g., note this"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <input
            type="text"
            value={formData.action}
            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            placeholder="e.g., create_note"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="note">Note</option>
          <option value="research">Research</option>
          <option value="reminder">Reminder</option>
        </select>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={() => onSave(formData)}
          disabled={!formData.phrase.trim() || !formData.action.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};