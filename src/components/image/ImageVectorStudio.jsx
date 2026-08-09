import React from 'react';
import { Info, Shield, Layers, FileCode, ExternalLink } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ImageVectorStudio({ selectedImage }) {
  const { theme } = useTheme();

  if (!selectedImage) {
    return (
      <div className={`p-12 text-center rounded-2xl border ${theme.card} space-y-3`}>
        <Info size={36} className="mx-auto text-slate-400 opacity-60" />
        <h4 className="font-bold text-sm">No image selected for metadata inspection</h4>
        <p className={`text-xs ${theme.textMuted}`}>Select an image from the Search Hub to view licensing, dimensions, and vector posterizer details.</p>
      </div>
    );
  }

  const aspectRatio = (selectedImage.width / selectedImage.height).toFixed(2);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b dark:border-slate-800 border-slate-200 pb-4">
        <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
          <Info className="text-indigo-400" size={18} /> Vector & Metadata Inspector
        </h3>
        <p className={`text-xs ${theme.textMuted}`}>Inspect licensing, file metrics, and SVG vector outline posterization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metadata Details Card */}
        <div className={`rounded-2xl border p-5 space-y-4 ${theme.card}`}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Shield size={14} className="text-emerald-400" /> Technical Metadata & License
          </h4>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b dark:border-slate-800/60 border-slate-200">
              <span className={theme.textMuted}>Asset Title:</span>
              <span className="font-bold truncate max-w-[200px]">{selectedImage.title}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b dark:border-slate-800/60 border-slate-200">
              <span className={theme.textMuted}>Dimensions:</span>
              <span className="font-mono font-bold">{selectedImage.width} × {selectedImage.height} px</span>
            </div>

            <div className="flex justify-between py-1.5 border-b dark:border-slate-800/60 border-slate-200">
              <span className={theme.textMuted}>Aspect Ratio:</span>
              <span className="font-mono font-bold">{aspectRatio}:1</span>
            </div>

            <div className="flex justify-between py-1.5 border-b dark:border-slate-800/60 border-slate-200">
              <span className={theme.textMuted}>License Type:</span>
              <span className="font-bold text-emerald-400">{selectedImage.license}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b dark:border-slate-800/60 border-slate-200">
              <span className={theme.textMuted}>Source Provider:</span>
              <span className="font-bold text-indigo-400">{selectedImage.source}</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className={theme.textMuted}>Creator Attribution:</span>
              <span className="font-semibold">{selectedImage.creator}</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={selectedImage.license_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              Verify License Details <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Vector Posterizer Simulator Preview */}
        <div className={`rounded-2xl border p-5 space-y-4 ${theme.card}`}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers size={14} className="text-indigo-400" /> SVG Posterizer & Vector Trace Preview
          </h4>

          <div className="h-56 w-full rounded-xl overflow-hidden bg-slate-950 p-4 border border-slate-800 flex items-center justify-center relative group">
            {/* Contrast SVG threshold simulator */}
            <svg width="100%" height="100%" viewBox="0 0 400 250" className="opacity-90">
              <filter id="vectorTrace">
                <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
                <feComponentTransfer>
                  <feFuncR type="discrete" tableValues="0 0.5 1" />
                  <feFuncG type="discrete" tableValues="0 0.5 1" />
                  <feFuncB type="discrete" tableValues="0 0.5 1" />
                </feComponentTransfer>
              </filter>
              <image href={selectedImage.thumbnail} width="400" height="250" preserveAspectRatio="xMidYMid slice" filter="url(#vectorTrace)" />
            </svg>
            <span className="absolute bottom-2 right-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-indigo-300 backdrop-blur-md">
              Vector Filter Simulation
            </span>
          </div>

          <p className={`text-[11px] ${theme.textMuted} leading-relaxed`}>
            The vector posterizer generates high-contrast SVG path outlines suitable for vector graphics workflows, iconography baselines, and stencil design.
          </p>
        </div>
      </div>
    </div>
  );
}
