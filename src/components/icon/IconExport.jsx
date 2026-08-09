import React, { useState } from 'react';
import { Copy, FileCode, Download, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { convertSvgToJsx } from './iconUtils';

export default function IconExport({ modifiedSvg, selectedIcon }) {
  const { theme } = useTheme();
  const [copiedType, setCopiedType] = useState(null);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const downloadSvgFile = () => {
    if (!modifiedSvg) return;
    const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const name = selectedIcon ? selectedIcon.split(':').pop() : 'custom-icon';
    link.download = `${name}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Convert SVG code to JSX format
  const jsxCode = convertSvgToJsx(modifiedSvg);

  return (
    <div className="space-y-6">
      {/* Sub header */}
      <div>
        <h3 className="text-lg font-bold tracking-tight">Export Hub</h3>
        <p className={`text-xs ${theme.textMuted}`}>Export custom icons as React JSX elements, raw SVG markup, or vector file downloads.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Code Viewers */}
        <div className={`border rounded-3xl p-6 space-y-4 ${theme.card}`}>
          <h4 className="text-xs font-black uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <FileCode size={14} className="text-indigo-400" /> Clipboard Codes
          </h4>

          {modifiedSvg ? (
            <div className="space-y-4">
              {/* React JSX */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase opacity-80">React JSX SVG Element</span>
                  <button
                    onClick={() => copyToClipboard(jsxCode, 'jsx')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all ${
                      copiedType === 'jsx' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : theme.isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {copiedType === 'jsx' ? <Check size={11} /> : <Copy size={11} />} Copy
                  </button>
                </div>
                <textarea
                  readOnly
                  value={jsxCode}
                  className="w-full h-16 p-2 rounded-xl text-[9px] font-mono select-all bg-slate-950/60 dark:bg-slate-950/80 border border-slate-500/15 focus:outline-none overflow-y-auto"
                />
              </div>

              {/* Raw SVG */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase opacity-80">Raw SVG Code</span>
                  <button
                    onClick={() => copyToClipboard(modifiedSvg, 'svg')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all ${
                      copiedType === 'svg' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : theme.isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {copiedType === 'svg' ? <Check size={11} /> : <Copy size={11} />} Copy
                  </button>
                </div>
                <textarea
                  readOnly
                  value={modifiedSvg}
                  className="w-full h-16 p-2 rounded-xl text-[9px] font-mono select-all bg-slate-950/60 dark:bg-slate-950/80 border border-slate-500/15 focus:outline-none overflow-y-auto"
                />
              </div>
            </div>
          ) : (
            <div className="h-48 border border-dashed rounded-xl flex items-center justify-center text-xs italic opacity-60">
              No icon selected to export.
            </div>
          )}
        </div>

        {/* Downloads */}
        <div className={`border rounded-3xl p-6 space-y-4 flex flex-col justify-between ${theme.card}`}>
          <h4 className="text-xs font-black uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <Download size={14} className="text-indigo-400" /> Vector Download
          </h4>

          {modifiedSvg ? (
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              <button
                onClick={downloadSvgFile}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow transition-all"
              >
                <Download size={14} /> Download Custom SVG Vector (.svg)
              </button>
            </div>
          ) : (
            <div className="h-48 border border-dashed rounded-xl flex items-center justify-center text-xs italic opacity-60">
              No icon selected to download.
            </div>
          )}

          <span className={`text-[10px] text-center italic pt-4 border-t border-slate-500/10 block ${theme.textMuted}`}>
            Downloads are standard SVG scalable vectors, compatible with Illustrator, Figma, or browser elements.
          </span>
        </div>

      </div>
    </div>
  );
}
