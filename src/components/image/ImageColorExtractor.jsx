import React, { useState, useEffect } from 'react';
import { Palette, Check, ArrowRight, Pipette, Sparkles, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { extractDominantPalette } from './imageUtils';

export default function ImageColorExtractor({ selectedImage, onSendToPaletteLab }) {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [palette, setPalette] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (!selectedImage) return;
    setLoading(true);
    extractDominantPalette(selectedImage.url, 5).then((extracted) => {
      setPalette(extracted);
      setLoading(false);
    });
  }, [selectedImage]);

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleSendToPaletteLab = () => {
    if (palette.length > 0 && onSendToPaletteLab) {
      onSendToPaletteLab(palette);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 2000);
    }
  };

  // Eyedropper API
  const handlePickCustomColor = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result.sRGBHex) {
          setPalette(prev => [result.sRGBHex, ...prev.slice(0, 4)]);
        }
      } catch (e) {
        console.log('Eyedropper closed');
      }
    } else {
      toast.error('EyeDropper API is not supported in this browser version.');
    }
  };

  if (!selectedImage) {
    return (
      <div className={`p-12 text-center rounded-2xl border ${theme.card} space-y-3`}>
        <Palette size={36} className="mx-auto text-slate-400 opacity-60" />
        <h4 className="font-bold text-sm">No image selected for color extraction</h4>
        <p className={`text-xs ${theme.textMuted}`}>Select any image from the Search Hub to sample its dominant 5-swatch palette.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-slate-800 border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
            <Palette className="text-indigo-400" size={18} /> Color Extractor Lab
          </h3>
          <p className={`text-xs ${theme.textMuted}`}>Client-side Canvas pixel quantization & dominant color sampler.</p>
        </div>

        {/* Optional Cross-Suite Trigger */}
        <button
          onClick={handleSendToPaletteLab}
          disabled={palette.length === 0}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
        >
          {sentSuccess ? (
            <>
              <Check size={14} /> Palette Sent to Palette Lab!
            </>
          ) : (
            <>
              <Sparkles size={14} /> Send Palette to Palette Lab <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>

      {/* Main Extractor Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Selected Image Preview */}
        <div className={`rounded-2xl overflow-hidden border ${theme.card} p-3 space-y-3`}>
          <div className="h-64 w-full rounded-xl overflow-hidden bg-slate-900 relative">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
            />
          </div>
          <div className="flex justify-between items-center px-1 text-xs">
            <span className="font-bold truncate max-w-[200px]">{selectedImage.title}</span>
            <span className={`text-[10px] ${theme.textMuted}`}>{selectedImage.width} × {selectedImage.height}px</span>
          </div>
        </div>

        {/* Extracted Swatches Canvas */}
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Swatches (Top 5)</h4>
            {'EyeDropper' in window && (
              <button
                onClick={handlePickCustomColor}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-all"
              >
                <Pipette size={12} className="text-indigo-400" /> Eyedropper Pick
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-indigo-400 font-bold flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin" /> Analyzing image pixel data...
            </div>
          ) : (
            <div className="space-y-3">
              {/* Connected Swatch Bar */}
              <div className="h-16 rounded-xl overflow-hidden flex border dark:border-slate-800 border-slate-200 shadow-md">
                {palette.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyHex(hex)}
                    style={{ backgroundColor: hex }}
                    className="flex-1 hover:scale-105 transition-transform relative group flex items-center justify-center"
                    title={`Click to copy: ${hex}`}
                  >
                    {copiedHex === hex ? (
                      <Check size={14} className="text-white drop-shadow-md" />
                    ) : (
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white drop-shadow-md">
                        {hex}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Hex Details List */}
              <div className="grid grid-cols-5 gap-2">
                {palette.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyHex(hex)}
                    className={`p-2 rounded-xl border text-center transition-all hover:border-indigo-500 ${
                      theme.isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-full h-4 rounded-md mb-1.5 border border-black/10" style={{ backgroundColor: hex }} />
                    <span className="text-[10px] font-mono font-bold block">{hex.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
