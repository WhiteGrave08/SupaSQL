
import React from 'react';
import { Database, GitBranch, Play, Share2, Search, Settings } from 'lucide-react';
import { useStore } from '../store';

export const Header: React.FC = () => {
  const { setSettingsOpen, setDeploying, setView, currentView } = useStore();

  return (
    <header className="h-14 border-b border-neutral-800 flex items-center justify-between px-4 bg-[#0a0a0a] sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('overview')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Database className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">SupaSQL</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-neutral-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 rounded-md border border-neutral-800 text-neutral-200 cursor-pointer hover:border-neutral-700 transition-colors">
            <GitBranch className="w-4 h-4" />
            <span>main</span>
          </div>
          <span className="text-neutral-700">/</span>
          <span className="hover:text-neutral-200 cursor-pointer" onClick={() => setView('overview')}>Project Dashboard</span>
          <span className="text-neutral-700">/</span>
          <span className={`text-neutral-100 capitalize ${currentView === 'editor' ? 'font-bold' : ''}`}>{currentView}</span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search commands (⌘K)"
            className="h-9 pl-9 pr-4 bg-neutral-900 border border-neutral-800 rounded-md text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        
        <button 
          onClick={() => setDeploying(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-neutral-100 text-neutral-900 rounded-md text-sm font-semibold hover:bg-neutral-200 transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Deploy</span>
        </button>
        
        <button className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-md transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setSettingsOpen(true)}
          className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-md transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
