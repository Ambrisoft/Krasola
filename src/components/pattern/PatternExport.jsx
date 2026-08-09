import React, { useState } from 'react';
import { Copy, FileCode, Download, Image as ImageIcon, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PatternExport({ fullSvg, cssBackgroundCode, patternType }) {
  const { theme } = useTheme();
  const [copiedType, setCopiedType] = useState(null);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const downloadSvgFile = () => {
    const blob = new Blob([fullSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${patternType}-pattern-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPngFile = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 600;
    
    const img = new Image();
    const svgBlob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 600, 600);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${patternType}-pattern-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(svgBlob);
  };

  return (
    <div className="space-y-6">
      {/* Sub header */}
      <div>
        <h3 className="text-lg font-bold tracking-tight">Export Hub</h3>
        <p className={`text-xs ${theme.textMuted}`}>Export designs as CSS declarations, raw SVG markup, vector downloads, or seamless PNG files.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Codes */}
        <div className={`border rounded-3xl p-6 space-y-4 ${theme.card}`}>
          <h4 className="text-xs font-black uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <FileCode size={14} className="text-indigo-400" /> Clipboard Codes
          </h4>
          
          <div className="space-y-4">
            {/* CSS inline */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase opacity-80">CSS background-image</span>
                <button
                  onClick={() => copyToClipboard(cssBackgroundCode, 'css')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all ${
                    copiedType === 'css' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : theme.isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {copiedType === 'css' ? <Check size={11} /> : <Copy size={11} />} Copy
                </button>
              </div>
              <textarea
                readOnly
                value={cssBackgroundCode}
                className="w-full h-16 p-2 rounded-xl text-[9px] font-mono select-all bg-slate-950/60 dark:bg-slate-950/80 border border-slate-500/15 focus:outline-none overflow-y-auto"
              />
            </div>

            {/* Raw SVG */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase opacity-80">Raw SVG Markup</span>
                <button
                  onClick={() => copyToClipboard(fullSvg, 'svg')}
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
                value={fullSvg}
                className="w-full h-16 p-2 rounded-xl text-[9px] font-mono select-all bg-slate-950/60 dark:bg-slate-950/80 border border-slate-500/15 focus:outline-none overflow-y-auto"
              />
            </div>
          </div>
        </div>

        {/* Files */}
        <div className={`border rounded-3xl p-6 space-y-4 flex flex-col justify-between ${theme.card}`}>
          <h4 className="text-xs font-black uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <Download size={14} className="text-indigo-400" /> File Exporters
          </h4>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <button
              onClick={downloadSvgFile}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow transition-all"
            >
              <Download size={14} /> Download Scalable Vector (.svg)
            </button>

            <button
              onClick={downloadPngFile}
              className={`w-full py-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                theme.isDark 
                  ? 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-200' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <ImageIcon size={14} /> Download Seamless Bitmap (.png)
            </button>
          </div>

          <span className={`text-[10px] text-center italic pt-4 border-t border-slate-500/10 block ${theme.textMuted}`}>
            Exported PNG patterns render at 600x600px resolution.
          </span>
        </div>

      </div>
    </div>
  );
}
