import React from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function IconPalette({ activePalette, color, setColor }) {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Sub header */}
      <div>
        <h3 className="text-lg font-bold tracking-tight">Palette Matcher</h3>
        <p className={`text-xs ${theme.textMuted}`}>Map active color palette values directly to the icon stroke and fill layers.</p>
      </div>

      {/* Active Palette strip */}
      <div className={`p-4 border rounded-3xl space-y-4 ${theme.card}`}>
        <div className="flex justify-between items-center border-b dark:border-slate-800 border-slate-200 pb-2">
          <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Source Color Palette</span>
          <span className={`text-[9px] ${theme.textMuted}`}>Imported from Palette Lab</span>
        </div>
        
        <div className="flex h-12 rounded-xl overflow-hidden border border-black/10">
          {activePalette.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs italic opacity-60">
              No palette loaded. Generate one in Palette Lab first!
            </div>
          ) : (
            activePalette.map((hex, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: hex }}
                className="flex-1 hover:scale-105 transition-transform cursor-pointer relative group flex items-center justify-center"
                title={`HEX: ${hex}`}
                onClick={() => {
                  navigator.clipboard.writeText(hex);
                  alert(`Copied HEX: ${hex}`);
                }}
              >
                <span className="text-[9px] font-bold text-white bg-slate-950/60 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx + 1}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mappings */}
      {activePalette.length > 0 && (
        <div className={`border rounded-2xl p-6 space-y-4 max-w-md ${theme.card}`}>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">Icon Fill / Stroke Color</h4>
            <p className={`text-[9px] mt-0.5 ${theme.textMuted}`}>Select a color to set the main color of the selected icon</p>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {activePalette.map((hex, idx) => (
              <button
                key={idx}
                onClick={() => setColor(hex)}
                style={{ backgroundColor: hex }}
                className="h-10 rounded-xl border border-black/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white"
                title={`Map color ${idx + 1} to Icon`}
              >
                {color === hex && <Check size={14} className="drop-shadow-md stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
