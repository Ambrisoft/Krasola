import React, { useState } from 'react';
import { Download, Copy, Check, FolderHeart, Code, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ImageExport({ selectedImage, onSaveImage }) {
  const { theme } = useTheme();
  const [copiedType, setCopiedType] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!selectedImage) {
    return (
      <div className={`p-12 text-center rounded-2xl border ${theme.card} space-y-3`}>
        <Download size={36} className="mx-auto text-slate-400 opacity-60" />
        <h4 className="font-bold text-sm">No image selected for export</h4>
        <p className={`text-xs ${theme.textMuted}`}>Select an image from the Search Hub to copy HTML/Markdown code or download high-res files.</p>
      </div>
    );
  }

  const markdownSnippet = `![${selectedImage.title}](${selectedImage.url})`;
  const htmlSnippet = `<img src="${selectedImage.url}" alt="${selectedImage.title}" width="${selectedImage.width}" height="${selectedImage.height}" loading="lazy" />`;
  const cssBackgroundSnippet = `background-image: url("${selectedImage.url}"); background-size: cover; background-position: center;`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const handleSaveToVault = () => {
    if (selectedImage && onSaveImage) {
      onSaveImage({
        id: selectedImage.id,
        title: selectedImage.title,
        url: selectedImage.url,
        thumbnail: selectedImage.thumbnail,
        creator: selectedImage.creator,
        license: selectedImage.license,
        width: selectedImage.width,
        height: selectedImage.height,
        savedAt: new Date().toISOString()
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-slate-800 border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
            <Download className="text-indigo-400" size={18} /> Export & Asset Vault
          </h3>
          <p className={`text-xs ${theme.textMuted}`}>Copy code snippets or save asset to Krasola local storage.</p>
        </div>

        {/* Save to Vault Action */}
        <button
          onClick={handleSaveToVault}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
        >
          {savedSuccess ? (
            <>
              <Check size={14} /> Saved to Vault!
            </>
          ) : (
            <>
              <FolderHeart size={14} /> Save Asset to Vault
            </>
          )}
        </button>
      </div>

      {/* Code Snippet Cards */}
      <div className="space-y-4">
        {/* Markdown Snippet */}
        <div className={`rounded-2xl border p-4 space-y-2 ${theme.card}`}>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5"><Code size={14} className="text-sky-400" /> Markdown Image Tag</span>
            <button
              onClick={() => handleCopy(markdownSnippet, 'markdown')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1 transition-all ${
                theme.isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {copiedType === 'markdown' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copiedType === 'markdown' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className={`p-3 rounded-xl text-xs font-mono overflow-x-auto border ${theme.isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
            {markdownSnippet}
          </pre>
        </div>

        {/* HTML Tag Snippet */}
        <div className={`rounded-2xl border p-4 space-y-2 ${theme.card}`}>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5"><Code size={14} className="text-emerald-400" /> HTML Responsive Image Tag</span>
            <button
              onClick={() => handleCopy(htmlSnippet, 'html')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1 transition-all ${
                theme.isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {copiedType === 'html' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copiedType === 'html' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className={`p-3 rounded-xl text-xs font-mono overflow-x-auto border ${theme.isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
            {htmlSnippet}
          </pre>
        </div>

        {/* CSS Background Property */}
        <div className={`rounded-2xl border p-4 space-y-2 ${theme.card}`}>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5"><Code size={14} className="text-indigo-400" /> CSS Background Snippet</span>
            <button
              onClick={() => handleCopy(cssBackgroundSnippet, 'css')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1 transition-all ${
                theme.isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {copiedType === 'css' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copiedType === 'css' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className={`p-3 rounded-xl text-xs font-mono overflow-x-auto border ${theme.isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
            {cssBackgroundSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
