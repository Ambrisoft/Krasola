import React from 'react';
import { Trash2, ArrowUpRight, Globe, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SavedAssets({ 
  savedPalettes, 
  savedPatterns, 
  savedIcons, 
  savedImages = [], 
  onDeletePalette, 
  onDeletePattern, 
  onDeleteIcon, 
  onDeleteImage, 
  onLoadPalette,
  onTogglePublic,
  user
}) {
  const { theme } = useTheme();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span>💼</span> Saved Assets Hub
        </h2>
        <p className={`text-xs ${theme.textMuted}`}>Manage saved palettes, pattern configurations, and cloud visibility settings.</p>
      </div>

      {/* Palettes section */}
      <div className="space-y-4">
        <h3 className={`text-sm font-semibold border-b pb-2 ${theme.border}`}>Saved Palettes ({savedPalettes.length})</h3>
        {savedPalettes.length === 0 ? (
          <p className={`text-xs italic ${theme.textMuted}`}>No palettes saved yet. Head over to Palette Lab to save some!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPalettes.map((palette, idx) => (
              <div key={idx} className={`rounded-xl border p-4 space-y-3 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 ${theme.card}`}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-sm font-semibold block">{palette.name}</span>
                    <div className="mt-1 flex items-center gap-1.5">
                      {palette.is_public ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                          <Globe size={10} /> Public
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-500/10 border border-slate-500/20 text-slate-400 flex items-center gap-1">
                          <Lock size={10} /> Private
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeletePalette(idx)}
                    className="text-slate-400 hover:text-red-400 transition-colors p-1"
                    title="Delete palette"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex h-10 rounded-lg overflow-hidden border dark:border-slate-800 border-slate-200">
                  {palette.colors.map((color, cIdx) => (
                    <div
                      key={cIdx}
                      style={{ backgroundColor: color }}
                      className="flex-1 hover:scale-105 transition-transform cursor-pointer"
                      title={color}
                      onClick={() => copyToClipboard(color)}
                    />
                  ))}
                </div>

                <div className="flex justify-between gap-1.5 pt-1">
                  <button
                    onClick={() => onLoadPalette(palette.colors)}
                    className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg text-white flex items-center justify-center gap-1 transition-all"
                  >
                    Load <ArrowUpRight size={12} />
                  </button>

                  {onTogglePublic && (
                    <button
                      onClick={() => onTogglePublic('palette', palette)}
                      className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border flex items-center gap-1 transition-all ${
                        palette.is_public
                          ? 'border-slate-700 hover:bg-slate-800 text-slate-400'
                          : 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                      }`}
                      title={palette.is_public ? "Make Private" : "Make Public"}
                    >
                      {palette.is_public ? <Lock size={10} /> : <Globe size={10} />}
                      {palette.is_public ? "Make Private" : "Make Public"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patterns Section */}
      <div className="space-y-4">
        <h3 className={`text-sm font-semibold border-b pb-2 ${theme.border}`}>Saved Pattern Schemes ({savedPatterns.length})</h3>
        {savedPatterns.length === 0 ? (
          <p className={`text-xs italic ${theme.textMuted}`}>No patterns saved yet. Head over to Pattern Studio to customize and save configurations!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPatterns.map((pattern, idx) => (
              <div key={idx} className={`rounded-xl border p-4 space-y-3 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 ${theme.card}`}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-sm font-semibold block">{pattern.name}</span>
                    <div className="mt-1 flex items-center gap-1.5">
                      {pattern.is_public ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                          <Globe size={10} /> Public
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-500/10 border border-slate-500/20 text-slate-400 flex items-center gap-1">
                          <Lock size={10} /> Private
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeletePattern(idx)}
                    className="text-slate-400 hover:text-red-400 transition-colors p-1"
                    title="Delete pattern"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="h-20 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden relative flex items-center justify-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                    Template: {pattern.patternType || pattern.pattern_type}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className={`text-[10px] ${theme.textMuted}`}>Scale: {pattern.settings?.scale || pattern.scale}x</span>
                  {onTogglePublic && (
                    <button
                      onClick={() => onTogglePublic('pattern', pattern)}
                      className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border flex items-center gap-1 transition-all ${
                        pattern.is_public
                          ? 'border-slate-700 hover:bg-slate-800 text-slate-400'
                          : 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                      }`}
                      title={pattern.is_public ? "Make Private" : "Make Public"}
                    >
                      {pattern.is_public ? <Lock size={10} /> : <Globe size={10} />}
                      {pattern.is_public ? "Make Private" : "Make Public"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Icons Section */}
      <div className="space-y-4">
        <h3 className={`text-sm font-semibold border-b pb-2 ${theme.border}`}>Favorite Icons ({savedIcons.length})</h3>
        {savedIcons.length === 0 ? (
          <p className={`text-xs italic ${theme.textMuted}`}>No icons saved yet. Find and customize icons inside Icon Finder!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedIcons.map((icon, idx) => (
              <div key={idx} className={`rounded-xl border p-4 flex items-center justify-between backdrop-blur-xl transition-all duration-300 ${theme.card}`}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 p-2 bg-slate-950/45 rounded-lg border border-slate-800 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                  <div>
                    <h4 className="text-xs font-semibold truncate max-w-[120px]">{icon.name}</h4>
                    <p className={`text-[9px] ${theme.textMuted}`}>Ready to copy</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(icon.svg)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      theme.isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-650'
                    }`}
                    title="Copy SVG XML"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => onDeleteIcon(idx)}
                    className="p-1.5 hover:bg-red-950/30 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="space-y-4">
        <h3 className={`text-sm font-semibold border-b pb-2 ${theme.border}`}>Saved Image Assets ({savedImages.length})</h3>
        {savedImages.length === 0 ? (
          <p className={`text-xs italic ${theme.textMuted}`}>No images saved yet. Search and save stock images inside Image Studio!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedImages.map((img, idx) => (
              <div key={idx} className={`rounded-xl border p-4 space-y-3 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 ${theme.card}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold truncate max-w-[180px]">{img.title}</span>
                  <button
                    onClick={() => onDeleteImage(idx)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="h-28 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 relative">
                  <img src={img.thumbnail || img.url} alt={img.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className={theme.textMuted}>By {img.creator}</span>
                  <button
                    onClick={() => copyToClipboard(img.url)}
                    className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all ${
                      theme.isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
