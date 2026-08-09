import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Unlock, 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  Grid, 
  Plus, 
  Trash2, 
  Shuffle,
  Pipette,
  Copy,
  Disc
} from 'lucide-react';
import { 
  generateRandomColor, 
  getContrastRatio, 
  hexToHsl, 
  hslToHex, 
  generateHarmoniousPalette,
  getHarmoniousInsertedColor
} from '../../utils/colorUtils';
import { useTheme } from '../../context/ThemeContext';
import ColorWheelModal from './ColorWheelModal';
import HslAdjusterModal from './HslAdjusterModal';

export default function PaletteGenerator({ colors, setColors, showToast }) {
  const { theme } = useTheme();
  const [activeShadeIndex, setActiveShadeIndex] = useState(null);
  const [activeSlidersIndex, setActiveSlidersIndex] = useState(null);
  const [activeWheelIndex, setActiveWheelIndex] = useState(null);
  const [harmonyRule, setHarmonyRule] = useState('random');
  const colorInputRefs = useRef({});

  // Lock toggle
  const toggleLock = (idx) => {
    setColors(prev => prev.map((c, i) => i === idx ? { ...c, isLocked: !c.isLocked } : c));
  };

  // Reordering (left/right)
  const shiftSwatch = (idx, direction) => {
    if (direction === 'left' && idx > 0) {
      setColors(prev => {
        const next = [...prev];
        const temp = next[idx];
        next[idx] = next[idx - 1];
        next[idx - 1] = temp;
        return next;
      });
    } else if (direction === 'right' && idx < colors.length - 1) {
      setColors(prev => {
        const next = [...prev];
        const temp = next[idx];
        next[idx] = next[idx + 1];
        next[idx + 1] = temp;
        return next;
      });
    }
  };

  // Adjust specific swatch hex
  const updateHex = (idx, hexValue) => {
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
      setColors(prev => prev.map((c, i) => i === idx ? { ...c, hex: hexValue } : c));
    }
  };

  // Remove swatch
  const removeSwatch = (idx) => {
    if (colors.length <= 2) return;
    setColors(prev => prev.filter((_, i) => i !== idx));
  };

  // Adobe-Grade Swatch Addition: Perceptual Vector Interpolation & Rule Alignment (Max 12)
  const addSwatch = (idx) => {
    if (colors.length >= 12) return;
    
    if (harmonyRule && harmonyRule !== 'random') {
      const baseIdx = colors.findIndex(c => !c.isLocked);
      const baseHex = baseIdx !== -1 ? colors[baseIdx].hex : colors[0].hex;
      const newCount = colors.length + 1;
      const newHarmoniousPalette = generateHarmoniousPalette(baseHex, harmonyRule, newCount);
      
      setColors(prev => {
        const next = [...prev];
        const insertedHex = getHarmoniousInsertedColor(prev, idx, harmonyRule);
        next.splice(idx + 1, 0, { hex: insertedHex, isLocked: false });
        return next.map((c, i) => c.isLocked ? c : { ...c, hex: newHarmoniousPalette[i] || c.hex });
      });
    } else {
      const insertedHex = getHarmoniousInsertedColor(colors, idx, harmonyRule);
      const newColor = { hex: insertedHex, isLocked: false };
      setColors(prev => {
        const next = [...prev];
        next.splice(idx + 1, 0, newColor);
        return next;
      });
    }
    if (showToast) showToast('Inserted harmonized color swatch!');
  };

  // EyeDropper API Screen Picker Integration
  const openEyeDropper = async (idx) => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          updateHex(idx, result.sRGBHex);
          if (showToast) showToast(`Picked color ${result.sRGBHex.toUpperCase()}`);
        }
      } catch (err) {
        console.warn('EyeDropper cancelled:', err);
      }
    } else if (showToast) {
      showToast('EyeDropper API is not supported in this browser environment');
    }
  };

  // Dynamic Harmonious Generator based on exact palette count N
  const handleGenerate = () => {
    if (harmonyRule === 'random') {
      setColors(prev => prev.map(c => c.isLocked ? c : { ...c, hex: generateRandomColor() }));
    } else {
      // If any swatch is locked, anchor on the locked color; otherwise roll a fresh base color on every click!
      const lockedIdx = colors.findIndex(c => c.isLocked);
      const baseHex = lockedIdx !== -1 ? colors[lockedIdx].hex : generateRandomColor();
      
      const harmoniousHexes = generateHarmoniousPalette(baseHex, harmonyRule, colors.length);
      
      setColors(prev => prev.map((c, i) => {
        if (c.isLocked) return c;
        return { ...c, hex: harmoniousHexes[i] || generateRandomColor() };
      }));
    }
  };

  // Keyboard shortcut Spacebar Focus Fix: Checks non-text input target tags
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [colors, harmonyRule]);

  // Generate Shades/Tints variations
  const getShades = (hex) => {
    const hsl = hexToHsl(hex);
    const variations = [];
    for (let l = 10; l <= 90; l += 10) {
      variations.push(hslToHex(hsl.h, hsl.s, l));
    }
    return variations;
  };

  // Adjust HSL Sliders handler
  const handleHslSlider = (idx, type, val) => {
    setColors(prev => prev.map((c, i) => {
      if (i !== idx) return c;
      const hsl = hexToHsl(c.hex);
      hsl[type] = parseInt(val);
      return { ...c, hex: hslToHex(hsl.h, hsl.s, hsl.l) };
    }));
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Generator Top Bar */}
      <div className={`p-4 border rounded-2xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl transition-all duration-300 ${theme.card}`}>
        <div className="flex items-center gap-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${theme.textMuted}`}>Generator Mode:</label>
          <select
            value={harmonyRule}
            onChange={(e) => setHarmonyRule(e.target.value)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-all cursor-pointer ${
              theme.isDark 
                ? 'bg-slate-800/90 border-slate-700 text-slate-200 focus:border-indigo-500' 
                : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
            }`}
          >
            <option value="random">Random Aesthetic</option>
            <option value="monochromatic">Monochromatic</option>
            <option value="analogous">Analogous</option>
            <option value="complementary">Complementary</option>
            <option value="triadic">Triadic</option>
            <option value="split-complementary">Split Complementary</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className={`hidden sm:inline text-xs ${theme.textMuted}`}>
            Press <kbd className="font-bold bg-slate-500/10 px-1.5 py-0.5 rounded text-[10px]">Spacebar</kbd> to roll
          </span>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20"
          >
            <Shuffle size={14} /> Generate
          </button>
        </div>
      </div>

      {/* Main Colors Container: Fluid 1-Row for N<=5, Adobe 6-Col Grid for N>5 */}
      <div className={`flex-1 min-h-[420px] rounded-3xl overflow-hidden border transition-all duration-500 ${
        theme.isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/70 border-slate-200'
      } ${
        colors.length > 5 
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 p-2.5' 
          : 'flex flex-col md:flex-row p-1'
      }`}>
        {colors.map((color, idx) => {
          const isContrastWhite = getContrastRatio(color.hex, '#ffffff') > 3;
          const contrastColor = isContrastWhite ? '#ffffff' : '#000000';
          const contrastScore = getContrastRatio(color.hex, contrastColor);
          const shades = getShades(color.hex);
          const hsl = hexToHsl(color.hex);

          const isLargePalette = colors.length > 5;

          return (
            <div
              key={idx}
              style={{ backgroundColor: color.hex }}
              className={`relative flex flex-col justify-between transition-all duration-300 group select-none items-center md:items-stretch ${
                isLargePalette 
                  ? 'h-48 rounded-2xl p-3 border border-white/10 shadow-lg' 
                  : 'flex-1 min-w-0 p-4 sm:p-5 rounded-2xl'
              }`}
            >
              {/* Swatch Header: Actions */}
              <div className="flex justify-between items-center w-full opacity-80 group-hover:opacity-100 transition-opacity">
                {/* Lock icon */}
                <button
                  onClick={() => toggleLock(idx)}
                  style={{ color: contrastColor }}
                  className="p-1 rounded-lg bg-black/10 hover:bg-black/20 backdrop-blur-md transition-all text-xs"
                  title={color.isLocked ? "Unlock Color" : "Lock Color"}
                >
                  {color.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>

                {/* WCAG Pass badge */}
                <span
                  style={{ color: contrastColor }}
                  className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-black/10 backdrop-blur-md truncate max-w-[80px]"
                  title={`Contrast Ratio: ${contrastScore}:1`}
                >
                  {contrastScore > 4.5 ? 'WCAG ✅' : 'Low ⚠️'}
                </span>
              </div>

              {/* Middle control buttons (Native Picker, EyeDropper, Shades, Sliders, Shifts, Delete) */}
              <div className="flex flex-col items-center gap-1.5 my-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-20">
                <div className="flex items-center gap-1">
                  {/* EyeDropper API button */}
                  <button
                    onClick={() => openEyeDropper(idx)}
                    style={{ color: contrastColor, borderColor: `${contrastColor}30` }}
                    className="w-7 h-7 rounded-lg border flex items-center justify-center bg-black/15 hover:bg-black/30 backdrop-blur-md transition-all"
                    title="Pick Color from Screen (EyeDropper)"
                  >
                    <Pipette size={12} />
                  </button>

                  {/* Adobe 360-Degree Interactive Color Wheel Trigger */}
                  <button
                    onClick={() => {
                      setActiveShadeIndex(null);
                      setActiveSlidersIndex(null);
                      setActiveWheelIndex(activeWheelIndex === idx ? null : idx);
                    }}
                    style={{ color: contrastColor, borderColor: `${contrastColor}30` }}
                    className="w-7 h-7 rounded-lg border flex items-center justify-center bg-black/15 hover:bg-black/30 backdrop-blur-md transition-all"
                    title="Adobe 360° Interactive Color Wheel"
                  >
                    <Disc size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {/* Shades Panel button */}
                  <button
                    onClick={() => {
                      setActiveSlidersIndex(null);
                      setActiveShadeIndex(activeShadeIndex === idx ? null : idx);
                    }}
                    style={{ color: contrastColor, borderColor: `${contrastColor}30` }}
                    className="w-7 h-7 rounded-lg border flex items-center justify-center bg-black/15 hover:bg-black/30 backdrop-blur-md transition-all"
                    title="View Tints & Shades"
                  >
                    <Grid size={12} />
                  </button>

                  {/* Sliders panel button */}
                  <button
                    onClick={() => {
                      setActiveShadeIndex(null);
                      setActiveSlidersIndex(activeSlidersIndex === idx ? null : idx);
                    }}
                    style={{ color: contrastColor, borderColor: `${contrastColor}30` }}
                    className="w-7 h-7 rounded-lg border flex items-center justify-center bg-black/15 hover:bg-black/30 backdrop-blur-md transition-all"
                    title="HSL Fine-Tuner"
                  >
                    <Sliders size={12} />
                  </button>
                </div>

                {/* Swapping Arrows & Delete */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => shiftSwatch(idx, 'left')}
                    disabled={idx === 0}
                    style={{ color: contrastColor, borderColor: `${contrastColor}20` }}
                    className="w-6 h-6 rounded-md border flex items-center justify-center bg-black/10 hover:bg-black/25 backdrop-blur-sm transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft size={11} />
                  </button>
                  <button
                    onClick={() => shiftSwatch(idx, 'right')}
                    disabled={idx === colors.length - 1}
                    style={{ color: contrastColor, borderColor: `${contrastColor}20` }}
                    className="w-6 h-6 rounded-md border flex items-center justify-center bg-black/10 hover:bg-black/25 backdrop-blur-sm transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronRight size={11} />
                  </button>

                  {colors.length > 2 && (
                    <button
                      onClick={() => removeSwatch(idx)}
                      style={{ color: contrastColor, borderColor: `${contrastColor}30` }}
                      className="w-6 h-6 rounded-md border flex items-center justify-center bg-black/15 hover:bg-red-650/40 hover:text-red-300 backdrop-blur-md transition-all"
                      title="Remove Swatch"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>

              {/* Swatch Footer: HEX display & Color Input */}
              <div className="flex flex-col items-center gap-1 w-full relative z-20">
                <input
                  type="text"
                  value={color.hex.toUpperCase()}
                  onChange={(e) => updateHex(idx, e.target.value)}
                  style={{ color: contrastColor }}
                  maxLength={7}
                  className={`text-center font-black tracking-wider bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/50 focus:outline-none transition-all cursor-pointer ${
                    colors.length >= 6 ? 'w-20 text-xs sm:text-sm' : 'w-24 text-base sm:text-lg'
                  }`}
                />
                
                {/* Hover button to insert color swatch in-between */}
                {colors.length < 12 && (
                  <button
                    onClick={() => addSwatch(idx)}
                    className={`absolute w-5 h-5 rounded-full bg-white text-slate-900 border border-slate-200 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all z-30 ${
                      isLargePalette ? '-right-2 top-0' : '-right-3 top-1/2 -translate-y-1/2'
                    }`}
                    title="Insert Color Swatch Here"
                  >
                    <Plus size={11} strokeWidth={3} />
                  </button>
                )}
              </div>

              {/* Adobe 360-Degree Interactive Canvas Color Wheel Modal */}
              {activeWheelIndex === idx && (
                <ColorWheelModal
                  hex={color.hex}
                  onChangeHex={(newHex) => updateHex(idx, newHex)}
                  onClose={() => setActiveWheelIndex(null)}
                />
              )}

              {/* Tints & Shades Modal Popup */}
              {activeShadeIndex === idx && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 p-4 flex flex-col justify-center gap-2">
                  <div className="flex justify-between items-center text-white border-b border-white/10 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Tints & Shades</span>
                    <button
                      onClick={() => setActiveShadeIndex(null)}
                      className="text-xs font-bold px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-all"
                    >
                      Close
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {shades.map((shadeHex, sIdx) => {
                      const shadeContrast = getContrastRatio(shadeHex, '#ffffff') > 3 ? '#ffffff' : '#000000';
                      return (
                        <button
                          key={sIdx}
                          onClick={() => {
                            updateHex(idx, shadeHex);
                            setActiveShadeIndex(null);
                            if (showToast) showToast(`Updated swatch to ${shadeHex.toUpperCase()}`);
                          }}
                          style={{ backgroundColor: shadeHex, color: shadeContrast }}
                          className="h-10 rounded-lg text-[9px] font-bold flex items-center justify-center border border-white/5 hover:scale-105 active:scale-95 transition-all shadow"
                        >
                          {shadeHex.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* HSL Sliders Draggable Portal Modal */}
              {activeSlidersIndex === idx && (
                <HslAdjusterModal
                  hex={color.hex}
                  onChangeHex={(newHex) => updateHex(idx, newHex)}
                  onClose={() => setActiveSlidersIndex(null)}
                />
              )}
            </div>
          );
        })}

        {/* Dedicated Adobe-Style "Add Swatch" Card Tile */}
        {colors.length < 12 && (
          <button
            type="button"
            onClick={() => addSwatch(colors.length - 1)}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-all duration-300 group hover:scale-[1.02] active:scale-95 cursor-pointer select-none ${
              colors.length > 5 ? 'h-48' : 'flex-1 min-w-[120px] min-h-[420px]'
            } ${
              theme.isDark
                ? 'border-slate-700/80 hover:border-indigo-500/80 bg-slate-900/40 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 shadow-inner'
                : 'border-slate-300 hover:border-indigo-500 bg-white/50 hover:bg-indigo-50/80 text-slate-500 hover:text-indigo-600 shadow-sm'
            }`}
            title="Add Color Swatch"
          >
            <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center shadow-sm group-hover:rotate-90 transition-transform duration-300">
              <Plus size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black uppercase tracking-wider">Add Swatch</span>
            <span className="text-[9px] font-bold opacity-60">({colors.length}/12)</span>
          </button>
        )}
      </div>
    </div>
  );
}
