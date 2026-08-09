import React, { useState, useEffect } from 'react';
import { 
  Shuffle, 
  Search, 
  Image as ImageIcon, 
  Eye, 
  Layout,
  Copy,
  FileJson,
  Download,
  FolderHeart,
  ChevronLeft,
  ChevronRight,
  Code,
  Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PaletteGenerator from './palette/PaletteGenerator';
import PaletteExplorer from './palette/PaletteExplorer';
import PaletteExtractor from './palette/PaletteExtractor';
import PaletteAccessibility from './palette/PaletteAccessibility';
import PaletteVisualizer from './palette/PaletteVisualizer';

export default function PaletteLab({ activePalette, setActivePalette, onSavePalette, enableShortcuts = true }) {
  const { theme } = useTheme();
  
  // Shared sub-app state: array of swatches { hex, isLocked }
  const [colors, setColors] = useState(() => 
    activePalette.map(hex => ({ hex, isLocked: false }))
  );
  
  const [activeSubTab, setActiveSubTab] = useState('explorer');
  const [isSubSidebarCollapsed, setIsSubSidebarCollapsed] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Synchronize changes back to parent activePalette so Pattern & Icon components can sync
  useEffect(() => {
    setActivePalette(colors.map(c => c.hex));
  }, [colors, setActivePalette]);

  // Non-blocking Toast notification banner trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Load a palette from Explorer, Extractor, etc.
  const handleLoadPalette = (newColors) => {
    setColors(newColors.map(hex => ({ hex, isLocked: false })));
    setActiveSubTab('generator'); // switch back to generator canvas
    showToast('Loaded palette into workspace generator!');
  };

  // Save palette dialog
  const handleSave = () => {
    const name = prompt('Enter a name for this palette:', `Palette #${Math.floor(Math.random() * 1000)}`);
    if (name) {
      onSavePalette({
        name,
        colors: colors.map(c => c.hex)
      });
      showToast(`Saved palette "${name}" to vault!`);
    }
  };

  // Copy CSS variables list
  const copyCSSList = () => {
    const cssText = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
    navigator.clipboard.writeText(cssText);
    setCopiedStatus('css');
    showToast('Copied CSS Variables!');
    setTimeout(() => setCopiedStatus(null), 1500);
  };

  // Copy Tailwind config object
  const copyTailwindList = () => {
    const obj = {};
    colors.forEach((c, i) => {
      obj[`color-${i + 1}`] = c.hex;
    });
    const twText = `colors: ${JSON.stringify(obj, null, 2)}`;
    navigator.clipboard.writeText(twText);
    setCopiedStatus('tailwind');
    showToast('Copied Tailwind CSS Config!');
    setTimeout(() => setCopiedStatus(null), 1500);
  };

  // Copy JSON list
  const copyJSONList = () => {
    const jsonText = JSON.stringify(colors.map(c => c.hex), null, 2);
    navigator.clipboard.writeText(jsonText);
    setCopiedStatus('json');
    showToast('Copied JSON Array!');
    setTimeout(() => setCopiedStatus(null), 1500);
  };

  // Download SVG palette file (Dynamic Scaling)
  const downloadSVG = () => {
    const swatchWidth = 120;
    const width = colors.length * swatchWidth;
    const height = 140;
    
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    colors.forEach((c, i) => {
      svgContent += `\n  <rect x="${i * swatchWidth}" y="0" width="${swatchWidth}" height="${height - 30}" fill="${c.hex}" />`;
      svgContent += `\n  <rect x="${i * swatchWidth}" y="${height - 30}" width="${swatchWidth}" height="30" fill="#0f172a" />`;
      svgContent += `\n  <text x="${i * swatchWidth + swatchWidth / 2}" y="${height - 10}" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">${c.hex.toUpperCase()}</text>`;
    });
    svgContent += '\n</svg>';
    
    const dataStr = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `palette_${Date.now()}.svg`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded SVG Vector Palette!');
  };

  const navItems = [
    { id: 'explorer', name: 'Explorer Hub', icon: Search },
    { id: 'generator', name: 'Generator Canvas', icon: Shuffle },
    { id: 'extractor', name: 'Extractor Studio', icon: ImageIcon },
    { id: 'accessibility', name: 'Accessibility Lab', icon: Eye },
    { id: 'visualizer', name: 'Visualizer Arena', icon: Layout }
  ];

  return (
    <div className={`flex flex-col lg:flex-row h-full rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden relative ${theme.card}`}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check size={14} /> {toastMessage}
        </div>
      )}

      {/* Collapsible Sub-Sidebar (Palette Lab Sub-routing) */}
      <aside className={`transition-all duration-300 border-b lg:border-b-0 lg:border-r flex flex-col justify-between shrink-0 relative ${
        isSubSidebarCollapsed ? 'w-full lg:w-16' : 'w-full lg:w-60'
      } ${
        theme.isDark ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50/50 border-slate-200'
      }`}>
        <div className="p-4 space-y-4">
          {/* Header titles */}
          <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3">
            {!isSubSidebarCollapsed && (
              <div>
                <h3 className="text-sm font-black tracking-tight">Palette Lab</h3>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Creator Suite</span>
              </div>
            )}
            
            {/* Collapse button for lg screens */}
            <button
              onClick={() => setIsSubSidebarCollapsed(!isSubSidebarCollapsed)}
              className="hidden lg:flex p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 text-xs text-slate-400 ml-auto transition-all"
              title={isSubSidebarCollapsed ? "Expand Sub-Sidebar" : "Collapse Sub-Sidebar"}
            >
              {isSubSidebarCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>
          </div>

          {/* Sub Navigation items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  title={item.name}
                  className={`w-full flex items-center rounded-xl text-xs font-bold transition-all ${
                    isSubSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-2.5'
                  } ${
                    isActive
                      ? theme.accent
                      : theme.isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  {!isSubSidebarCollapsed && <span>{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Save/Export Quick actions panel inside sub sidebar */}
        <div className={`p-4 border-t transition-colors duration-300 dark:border-slate-800 border-slate-200 ${
          isSubSidebarCollapsed ? 'flex flex-col items-center gap-3' : 'space-y-2'
        }`}>
          {!isSubSidebarCollapsed ? (
            <>
              <button
                onClick={handleSave}
                className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-650/10 transition-all"
              >
                <FolderHeart size={12} /> Save Palette
              </button>

              <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                <button
                  onClick={copyCSSList}
                  className={`py-1.5 rounded-lg text-[9px] font-extrabold uppercase border flex items-center justify-center gap-1 transition-all ${
                    copiedStatus === 'css' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : theme.isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                  title="Copy CSS variables"
                >
                  <Copy size={10} /> CSS Vars
                </button>

                <button
                  onClick={copyTailwindList}
                  className={`py-1.5 rounded-lg text-[9px] font-extrabold uppercase border flex items-center justify-center gap-1 transition-all ${
                    copiedStatus === 'tailwind' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : theme.isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                  title="Copy Tailwind CSS Config"
                >
                  <Code size={10} /> Tailwind
                </button>

                <button
                  onClick={copyJSONList}
                  className={`py-1.5 rounded-lg text-[9px] font-extrabold uppercase border flex items-center justify-center gap-1 transition-all ${
                    copiedStatus === 'json' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : theme.isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                  title="Copy JSON list"
                >
                  <FileJson size={10} /> JSON
                </button>

                <button
                  onClick={downloadSVG}
                  className={`py-1.5 rounded-lg text-[9px] font-extrabold uppercase border flex items-center justify-center gap-1 transition-all ${
                    theme.isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                  title="Download SVG vector file"
                >
                  <Download size={10} /> SVG
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Collapsed actions */}
              <button
                onClick={handleSave}
                className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow"
                title="Save Palette"
              >
                <FolderHeart size={13} />
              </button>
              <button
                onClick={copyCSSList}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                  copiedStatus === 'css' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-slate-500/5 hover:bg-slate-500/10'
                }`}
                title="Copy CSS"
              >
                <Copy size={13} />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Palette Lab Workspace Main Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {activeSubTab === 'generator' && (
          <PaletteGenerator 
            colors={colors} 
            setColors={setColors} 
            showToast={showToast}
          />
        )}

        {activeSubTab === 'explorer' && (
          <PaletteExplorer 
            onLoadPalette={handleLoadPalette} 
            showToast={showToast}
          />
        )}

        {activeSubTab === 'extractor' && (
          <PaletteExtractor 
            onLoadPalette={handleLoadPalette} 
            showToast={showToast}
          />
        )}

        {activeSubTab === 'accessibility' && (
          <PaletteAccessibility 
            colors={colors} 
            setColors={setColors}
            showToast={showToast}
          />
        )}

        {activeSubTab === 'visualizer' && (
          <PaletteVisualizer 
            colors={colors} 
          />
        )}
      </main>
    </div>
  );
}
