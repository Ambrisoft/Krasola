import React from 'react';
import { Sliders, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PatternCanvas({ 
  width, setWidth, 
  height, setHeight, 
  scale, setScale, 
  stroke, setStroke, 
  angle, setAngle,
  onInspireMe 
}) {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Sub header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Canvas Studio</h3>
          <p className={`text-xs ${theme.textMuted}`}>Fine-tune pattern dimensions, geometry scales, and angles.</p>
        </div>
        <button
          onClick={onInspireMe}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-tr from-amber-500 to-indigo-650 hover:from-amber-400 hover:to-indigo-500 active:scale-95 transition-all text-white text-xs font-bold rounded-xl shadow shadow-amber-500/10"
          title="Randomize parameters for quick designs"
        >
          <Sparkles size={13} className="text-amber-300 animate-pulse" /> Inspire Me
        </button>
      </div>

      {/* Sliders Panel */}
      <div className={`p-6 border rounded-3xl space-y-5 backdrop-blur-xl ${theme.card}`}>
        {/* Slider 1: Width */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Tile Width</span>
            <span className="font-bold">{width}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Slider 2: Height */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Tile Height</span>
            <span className="font-bold">{height}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Slider 3: Scale */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Geometry Scale</span>
            <span className="font-bold">{(scale * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Slider 4: Stroke */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Stroke Thickness</span>
            <span className="font-bold">{stroke}px</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={stroke}
            onChange={(e) => setStroke(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Slider 5: Angle */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Rotation Angle</span>
            <span className="font-bold">{angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
