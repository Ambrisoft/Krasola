import React, { useState, useEffect } from 'react';
import { X, Lock, Globe, Sparkles, Check, Info, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { getUniquePaletteName, getUniquePatternName } from '../utils/namingUtils';
import { formatBytes } from '../utils/imageCompression';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export default function SaveAssetModal({
  isOpen,
  onClose,
  onSave,
  assetType, // 'palette', 'pattern', or 'image'
  colors = [],
  patternData = null,
  imageData = null,
  existingNames = [],
  isLoggedIn = false
}) {
  const { theme } = useTheme();
  const { addNotification } = useNotifications();
  const [assetName, setAssetName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate initial smart name when modal opens (Default to Private Vault for 100% user choice)
  useEffect(() => {
    if (isOpen) {
      if (assetType === 'image' && imageData?.title) {
        setAssetName(imageData.title);
      } else {
        generateSmartName();
      }
      setIsPublic(false); // Always default to Private Vault; user must explicitly choose Public
    }
  }, [isOpen, assetType, colors, patternData, imageData]);

  const generateSmartName = async () => {
    setIsGenerating(true);
    try {
      if (assetType === 'palette') {
        const name = await getUniquePaletteName(colors, existingNames, isSupabaseConfigured ? supabase : null);
        setAssetName(name);
      } else if (assetType === 'pattern' && patternData) {
        const patternColors = [
          patternData.settings?.bg,
          patternData.settings?.color1,
          patternData.settings?.color2
        ].filter(Boolean);
        const name = await getUniquePatternName(
          patternData.patternType,
          patternData.settings,
          patternColors,
          existingNames,
          isSupabaseConfigured ? supabase : null
        );
        setAssetName(name);
      } else if (assetType === 'image' && imageData?.title) {
        setAssetName(imageData.title);
      }
    } catch (e) {
      setAssetName(assetType === 'palette' ? 'Custom Palette' : assetType === 'pattern' ? 'Custom Pattern' : 'Custom Artwork');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = assetName.trim();
    if (!cleanName) return;

    onSave({
      name: cleanName,
      title: cleanName,
      isPublic: isLoggedIn ? isPublic : false,
      imageData: imageData
    });

    addNotification({
      title: `${assetType === 'palette' ? 'Palette' : assetType === 'pattern' ? 'Pattern' : 'Image'} Saved`,
      message: `"${cleanName}" was successfully saved to your ${isLoggedIn ? (isPublic ? 'Public Showcase' : 'Private Cloud Vault') : 'Local Storage'}.`,
      type: 'asset_saved',
      category: assetType,
      actionTab: 'saved'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className={`w-full max-w-md rounded-3xl border p-6 space-y-6 shadow-2xl transition-all duration-300 relative overflow-hidden ${theme.card}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow decoration */}
        <div className="absolute w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl -top-10 -right-10 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" />
              <span>Save New {assetType === 'palette' ? 'Palette' : assetType === 'pattern' ? 'Pattern' : 'Image'}</span>
            </h3>
            <p className={`text-xs ${theme.textMuted}`}>
              Configure visibility & details before saving to your vault.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-full border transition-all ${
              theme.isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Asset Visual Preview Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Asset Preview</span>
            {assetType === 'image' && imageData?.compressedSize && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                WebP • {formatBytes(imageData.compressedSize)} {imageData.savingsPercent ? `(-${imageData.savingsPercent}%)` : ''}
              </span>
            )}
          </div>
          {assetType === 'palette' ? (
            <div className="flex h-12 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner">
              {colors.map((hex, idx) => (
                <div key={idx} style={{ backgroundColor: hex }} className="flex-1 h-full" title={hex} />
              ))}
            </div>
          ) : assetType === 'pattern' ? (
            <div 
              className="h-16 rounded-xl border border-slate-700/50 flex items-center justify-center text-xs font-bold text-slate-300"
              style={{ backgroundColor: patternData?.settings?.bg || '#0f172a' }}
            >
              <span className="px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm uppercase tracking-wider text-[10px]">
                {patternData?.patternType || 'Pattern'} Template
              </span>
            </div>
          ) : (
            <div className="h-28 rounded-xl border border-slate-700/50 overflow-hidden relative bg-slate-900 flex items-center justify-center">
              <img 
                src={imageData?.thumbnail || imageData?.url || imageData?.dataUrl} 
                alt={assetName} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold text-slate-200">
                {imageData?.width || 1920} × {imageData?.height || 1080}
              </div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Smart Asset Name Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Asset Name
              </label>
              <button
                type="button"
                onClick={generateSmartName}
                disabled={isGenerating}
                className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <Sparkles size={10} /> {isGenerating ? 'Generating...' : 'Regenerate'}
              </button>
            </div>
            <input
              type="text"
              required
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="Enter asset name..."
              className={`w-full text-xs px-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
                theme.isDark 
                  ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-indigo-500' 
                  : 'bg-white border-slate-300 text-slate-800 focus:border-indigo-500'
              }`}
            />
          </div>

          {/* Visibility Switcher Card */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Cloud Visibility Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Option 1: Private */}
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                  !isPublic
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-2 ring-indigo-500/20'
                    : theme.isDark 
                      ? 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700' 
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <Lock size={14} className={!isPublic ? 'text-indigo-400' : 'text-slate-400'} />
                  {!isPublic && <Check size={12} className="text-indigo-400" />}
                </div>
                <div>
                  <span className="text-xs font-bold block">Private Vault</span>
                  <span className="text-[9px] opacity-70 block">Only in your Saved Assets</span>
                </div>
              </button>

              {/* Option 2: Public */}
              <button
                type="button"
                disabled={!isLoggedIn}
                onClick={() => setIsPublic(true)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all relative ${
                  !isLoggedIn ? 'opacity-50 cursor-not-allowed border-slate-800 bg-slate-900/20' : ''
                } ${
                  isPublic && isLoggedIn
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-2 ring-emerald-500/20'
                    : theme.isDark 
                      ? 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700' 
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <Globe size={14} className={isPublic && isLoggedIn ? 'text-emerald-400' : 'text-slate-400'} />
                  {isPublic && isLoggedIn && <Check size={12} className="text-emerald-400" />}
                </div>
                <div>
                  <span className="text-xs font-bold block">Public Community</span>
                  <span className="text-[9px] opacity-70 block">Shared with Community feed</span>
                </div>
              </button>
            </div>

            {!isLoggedIn && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px]">
                <Info size={12} className="shrink-0" />
                <span>Sign in to publish your creations to the public Community gallery.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                theme.isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-300 hover:bg-slate-100 text-slate-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Check size={14} /> Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
