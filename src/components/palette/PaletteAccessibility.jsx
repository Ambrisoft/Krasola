import React, { useState } from 'react';
import { Eye, ShieldCheck, HelpCircle, Sparkles, Wand2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getContrastRatio, simulateColorBlindness, optimizePaletteForWCAG } from '../../utils/colorUtils';

export default function PaletteAccessibility({ colors, setColors, showToast }) {
  const { theme } = useTheme();
  const [blindnessType, setBlindnessType] = useState('normal');

  const getWCAGRating = (ratio) => {
    const score = parseFloat(ratio);
    if (score >= 7.0) return { label: 'AAA Pass ✅', color: 'text-emerald-400 bg-emerald-500/10' };
    if (score >= 4.5) return { label: 'AA Pass ✅', color: 'text-teal-400 bg-teal-500/10' };
    if (score >= 3.0) return { label: 'Large Text Only ⚠️', color: 'text-amber-400 bg-amber-500/10' };
    return { label: 'Fail ❌', color: 'text-red-400 bg-red-500/10' };
  };

  // Automated WCAG AA Optimizer trigger
  const handleAutoOptimize = () => {
    if (!setColors) return;
    const optimized = optimizePaletteForWCAG(colors);
    setColors(optimized);
    if (showToast) showToast('Optimized low-contrast swatches for WCAG AA compliance!');
  };

  return (
    <div className="space-y-8">
      {/* Sub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Accessibility & Contrast Lab</h3>
          <p className={`text-xs ${theme.textMuted}`}>Validate color combinations against WCAG readability standards and simulate color vision deficiencies.</p>
        </div>

        {setColors && (
          <button
            onClick={handleAutoOptimize}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-600/20 transition-all self-start sm:self-auto"
          >
            <Wand2 size={14} /> Auto-Optimize for WCAG AA
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Color Blindness Simulator */}
        <div className={`lg:col-span-2 border rounded-3xl p-6 backdrop-blur-xl space-y-6 ${theme.card}`}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 dark:border-slate-800 border-slate-200">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Eye size={16} className="text-indigo-400" /> Color Blindness Simulator
            </h4>

            <select
              value={blindnessType}
              onChange={(e) => setBlindnessType(e.target.value)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-all cursor-pointer ${
                theme.isDark 
                  ? 'bg-slate-800/90 border-slate-700 text-slate-200 focus:border-indigo-500' 
                  : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
              }`}
            >
              <option value="normal">Normal Vision</option>
              <option value="protanopia">Protanopia (Red-Blind)</option>
              <option value="protanomaly">Protanomaly (Red-Weak)</option>
              <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
              <option value="deuteranomaly">Deuteranomaly (Green-Weak)</option>
              <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              <option value="achromatopsia">Achromatopsia (Grayscale)</option>
            </select>
          </div>

          {/* Simulated swatches */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {colors.map((color, idx) => {
              const simulatedHex = simulateColorBlindness(color.hex, blindnessType);
              return (
                <div key={idx} className="space-y-2">
                  <div
                    style={{ backgroundColor: simulatedHex }}
                    className="h-28 rounded-2xl border border-black/10 shadow-inner transition-colors duration-300"
                  />
                  <div className="text-center">
                    <span className="block text-[10px] font-black tracking-wider uppercase">{color.hex.toUpperCase()}</span>
                    {blindnessType !== 'normal' && (
                      <span className={`text-[8px] font-bold uppercase ${theme.textMuted}`}>Simulated: {simulatedHex.toUpperCase()}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accessibility Guidelines Info card */}
        <div className="border rounded-3xl p-6 bg-indigo-500/5 border-indigo-500/10 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-400" /> WCAG Readability
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              The Web Content Accessibility Guidelines (WCAG) require text to contrast with its background for visual readability:
            </p>
            <ul className="space-y-2 text-[10px] font-semibold text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 
                <strong>AAA Pass (7.0+:1)</strong>: Maximum readability, safe for body text.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400" /> 
                <strong>AA Pass (4.5+:1)</strong>: Standard baseline for small elements.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 
                <strong>Large Only (3.0+:1)</strong>: Suitable for headlines/badges.
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-500/10 text-[9px] text-slate-500 flex items-center gap-1">
            <HelpCircle size={10} /> Double check pairings before exporting styles.
          </div>
        </div>
      </div>

      {/* Cross-Color Contrast Grid Matrix */}
      <div className={`border rounded-3xl p-6 backdrop-blur-xl space-y-4 ${theme.card}`}>
        <h4 className="text-sm font-bold border-b pb-4 dark:border-slate-800 border-slate-200">
          Contrast Matrix (Foreground vs Background pairings)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-500/10">
                <th className={`pb-3 text-[10px] font-extrabold uppercase ${theme.textMuted}`}>BG \ Text color</th>
                {colors.map((color, idx) => (
                  <th key={idx} className="pb-3 text-center">
                    <div style={{ backgroundColor: color.hex }} className="w-6 h-6 rounded-lg inline-block border border-black/10 shadow" title={color.hex} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {colors.map((bgCol, rowIdx) => (
                <tr key={rowIdx} className="border-b border-slate-500/10 hover:bg-slate-500/5 transition-colors">
                  <td className="py-3 flex items-center gap-2">
                    <div style={{ backgroundColor: bgCol.hex }} className="w-4 h-4 rounded border border-black/10" />
                    <span className="text-[10px] font-black tracking-wider uppercase">{bgCol.hex.toUpperCase()}</span>
                  </td>
                  {colors.map((textCol, colIdx) => {
                    const ratio = getContrastRatio(bgCol.hex, textCol.hex);
                    const rating = getWCAGRating(ratio);
                    return (
                      <td key={colIdx} className="py-3 text-center">
                        <div className={`p-2 rounded-xl text-center inline-block w-28 text-[9px] font-extrabold ${rating.color}`}>
                          <span className="block">{ratio}:1</span>
                          <span className="text-[7px] uppercase tracking-wider block opacity-70 mt-0.5">{rating.label}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
