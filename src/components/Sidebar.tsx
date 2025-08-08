import React from 'react';
import { Mic, BookOpen, Settings, Search, Plus } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'transcript', label: 'Process (Manual)', icon: Mic },
    { id: 'live', label: 'Live Stream', icon: Mic },
    { id: 'memories', label: 'Memories', icon: BookOpen },
    { id: 'hotphrases', label: 'Hot Phrases', icon: Settings },
    { id: 'search', label: 'Search', icon: Search },
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <div className="p-6">
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg py-3 px-4 flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Memory</span>
        </button>
      </div>
      
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};