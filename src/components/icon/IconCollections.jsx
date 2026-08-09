import React from 'react';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function IconCollections({ selectedCollection, setSelectedCollection }) {
  const { theme } = useTheme();

  const collections = [
    { prefix: '', name: 'All Libraries', desc: 'Queries all icons globally' },
    { prefix: 'lucide', name: 'Lucide Icons', desc: 'Modern vector paths for flat UIs' },
    { prefix: 'feather', name: 'Feather Icons', desc: 'Simple, clean open-source shapes' },
    { prefix: 'mdi', name: 'Material Design', desc: 'Google design system standard icons' },
    { prefix: 'carbon', name: 'IBM Carbon', desc: 'Professional elements for SaaS analytics' },
    { prefix: 'uil', name: 'Unicons', desc: 'Detailed, rounded vector outlines' },
    { prefix: 'ant-design', name: 'Ant Design', desc: 'Corporate outline/fill shapes sets' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub header */}
      <div>
        <h3 className="text-lg font-bold tracking-tight">Icon Collections</h3>
        <p className={`text-xs ${theme.textMuted}`}>Select a specific icon set library to focus and refine search queries results.</p>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((col) => {
          const isSelected = selectedCollection === col.prefix;
          return (
            <button
              key={col.prefix}
              onClick={() => setSelectedCollection(col.prefix)}
              className={`text-left rounded-2xl border p-4 flex flex-col justify-between h-28 transition-all duration-300 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/20'
                  : theme.isDark
                    ? 'border-slate-850 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/50'
                    : 'border-slate-200 hover:border-slate-350 bg-slate-50/20 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-black">
                  C
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider">{col.name}</span>
              </div>
              
              <p className={`text-[10px] ${theme.textMuted} mt-2`}>
                {col.desc}
              </p>
              
              <span className="text-[8px] font-bold uppercase tracking-widest mt-2 block text-indigo-400">
                {col.prefix ? `Prefix: ${col.prefix}` : 'All Prefixes'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
