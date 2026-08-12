import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Grid, 
  Palette, 
  Download, 
  FolderHeart,
  ChevronLeft,
  ChevronRight,
  Layout
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { 
  PATTERN_TYPES, 
  generateFullSvg, 
  generateCSSCode 
} from './pattern/patternUtils';
import { hslToHex } from '../utils/colorUtils';
import PatternGenerator from './pattern/PatternGenerator';
import PatternExplorer from './pattern/PatternExplorer';
import PatternPalette from './pattern/PatternPalette';
import PatternExport from './pattern/PatternExport';
import PatternVisualizer from './pattern/PatternVisualizer';
import { saveCommunityPattern } from '../utils/supabaseClient';

export default function PatternStudio({ activePalette = [], onSavePattern, showToast }) {
  const { theme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState('templates');
  const [isSubSidebarCollapsed, setIsSubSidebarCollapsed] = useState(false);
  const [isPaletteImported, setIsPaletteImported] = useState(false);

  // Pattern parameters
  const [patternType, setPatternType] = useState('dots');
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(40);
  const [scale, setScale] = useState(1);
  const [stroke, setStroke] = useState(2);
  const [angle, setAngle] = useState(0);

  // Mapped colors initialized from default template theme (Decoupled from Palette Lab until explicit import)
  const defaultDot = PATTERN_TYPES.dots;
  const [bg, setBg] = useState(defaultDot.defaultBg || '#0f172a');
  const [color1, setColor1] = useState(defaultDot.defaultColor1 || '#6366f1');
  const [color2, setColor2] = useState(defaultDot.defaultColor2 || '#38bdf8');

  // Explicit manual import from activePalette (Triggered ONLY when user clicks "Import Active Palette Colors")
  const handleImportPaletteColors = () => {
    const swatches = activePalette.map(c => typeof c === 'string' ? c : c.hex || '#6366f1');
    if (swatches.length >= 1) {
      setBg(swatches[0]);
      setColor1(swatches[1] || swatches[0]);
      setColor2(swatches[2] || swatches[1] || swatches[0]);
      setIsPaletteImported(true);
      if (showToast) showToast('Imported active palette from Palette Lab!');
    }
  };

  // Quick Swap Roles (Rotate BG -> Color1 -> Color2)
  const handleSwapColors = () => {
    const tempBg = bg;
    setBg(color1);
    setColor1(color2);
    setColor2(tempBg);
  };

  // Reset tile parameters to baseline defaults
  const handleResetDefaults = () => {
    setWidth(40);
    setHeight(40);
    setScale(1);
    setStroke(2);
    setAngle(0);
  };

  // Load template from gallery into Canvas Studio
  const handleLoadTemplate = (key) => {
    setPatternType(key);
    const targetObj = PATTERN_TYPES[key];
    if (targetObj && !isPaletteImported) {
      // If palette has NOT been imported, load template's curated aesthetic default theme!
      setBg(targetObj.defaultBg || '#0f172a');
      setColor1(targetObj.defaultColor1 || '#6366f1');
      setColor2(targetObj.defaultColor2 || '#38bdf8');
    }
    setActiveSubTab('canvas');
  };

  // Restore the original curated template default colors
  const handleRestoreDefaultColors = () => {
    setIsPaletteImported(false);
    const targetObj = PATTERN_TYPES[patternType];
    if (targetObj) {
      setBg(targetObj.defaultBg || '#0f172a');
      setColor1(targetObj.defaultColor1 || '#6366f1');
      setColor2(targetObj.defaultColor2 || '#38bdf8');
    }
    if (showToast) showToast("Restored pattern's original default colors!");
  };

  // SVG tile generators
  const patternObj = PATTERN_TYPES[patternType] || PATTERN_TYPES.dots;
  const innerPattern = patternObj.svg(width, height, scale, stroke, color1, color2, bg);

  // Full repeated SVG string
  const fullSvg = generateFullSvg(innerPattern, angle);
  const encodedSvg = encodeURIComponent(fullSvg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  const cssBackgroundCode = `background-image: url("data:image/svg+xml;utf8,${encodedSvg}");`;

  const [keepActivePaletteLinked, setKeepActivePaletteLinked] = useState(false);

  // "Inspire Me" randomizer: Rolls fresh harmonized color triads by default!
  const handleInspireMe = () => {
    setWidth(Math.floor(Math.random() * 80) + 30);
    setHeight(Math.floor(Math.random() * 80) + 30);
    setScale(parseFloat((Math.random() * 1.5 + 0.4).toFixed(2)));
    setStroke(Math.floor(Math.random() * 7) + 1);
    setAngle(Math.floor(Math.random() * 180));
    
    const keys = Object.keys(PATTERN_TYPES);
    setPatternType(keys[Math.floor(Math.random() * keys.length)]);
    
    const swatches = activePalette.map(c => typeof c === 'string' ? c : c?.hex || '#6366f1');

    if (keepActivePaletteLinked && swatches.length >= 2) {
      const shuffled = [...swatches].sort(() => 0.5 - Math.random());
      setBg(shuffled[0]);
      setColor1(shuffled[1]);
      setColor2(shuffled[2] || shuffled[0]);
    } else {
      // Generate fresh creative HSL color triad across 360-degree color wheel
      const baseH = Math.floor(Math.random() * 360);
      const bgHex = hslToHex(baseH, Math.floor(Math.random() * 30 + 10), Math.floor(Math.random() * 20 + 8));
      const c1Hex = hslToHex((baseH + 120 + Math.floor(Math.random() * 40 - 20)) % 360, Math.floor(Math.random() * 40 + 50), Math.floor(Math.random() * 40 + 50));
      const c2Hex = hslToHex((baseH + 240 + Math.floor(Math.random() * 40 - 20)) % 360, Math.floor(Math.random() * 40 + 50), Math.floor(Math.random() * 40 + 50));
      setBg(bgHex);
      setColor1(c1Hex);
      setColor2(c2Hex);
    }
  };

  // Save template configuration
  const handleSave = async () => {
    const name = prompt('Name this pattern config:', `${patternObj.name} Config`);
    if (name) {
      const publish = confirm('Would you like to publish this pattern to the Community Gallery?');
      const username = publish ? (prompt('Enter your display name for credit:', 'Anonymous Creator') || 'Anonymous Creator') : null;
      
      onSavePattern({
        name,
        patternType,
        settings: { width, height, scale, stroke, angle, bg, color1, color2 }
      });

      if (publish) {
        try {
          await saveCommunityPattern({
            name,
            patternType,
            settings: { width, height, scale, stroke, angle, bg, color1, color2 },
            username
          });
          if (showToast) showToast('Successfully published pattern to Community Gallery!');
        } catch (err) {
          console.error("Failed to publish pattern:", err);
        }
      }
    }
  };

  const handleLoadCommunityPattern = (pattern) => {
    setPatternType(pattern.pattern_type);
    setWidth(pattern.width);
    setHeight(pattern.height);
    setScale(pattern.scale);
    setStroke(pattern.stroke);
    setAngle(pattern.angle);
    setBg(pattern.bg);
    setColor1(pattern.color1);
    setColor2(pattern.color2);
    setIsPaletteImported(false);
    setActiveSubTab('canvas');
    if (showToast) showToast(`Loaded pattern: ${pattern.name}`);
  };

  const navItems = [
    { id: 'templates', name: 'Templates Gallery', icon: Grid },
    { id: 'canvas', name: 'Canvas Studio', icon: Sliders },
    { id: 'palette', name: 'Palette Connector', icon: Palette },
    { id: 'visualizer', name: 'Visualizer Arena', icon: Layout },
    { id: 'export', name: 'Export Hub', icon: Download }
  ];

  return (
    <div className={`flex flex-col lg:flex-row h-full rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden ${theme.card}`}>
      {/* Collapsible Sub-Sidebar */}
      <aside className={`transition-all duration-300 border-b lg:border-b-0 lg:border-r flex flex-col justify-between shrink-0 relative z-20 ${
        isSubSidebarCollapsed ? 'w-full lg:w-16' : 'w-full lg:w-60'
      } ${
        theme.isDark ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50/50 border-slate-200'
      }`}>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3">
            {!isSubSidebarCollapsed && (
              <div>
                <h3 className="text-sm font-black tracking-tight">Pattern Studio</h3>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Creator Suite</span>
              </div>
            )}
            
            <button
              onClick={() => setIsSubSidebarCollapsed(!isSubSidebarCollapsed)}
              className="hidden lg:flex p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 text-xs text-slate-400 ml-auto transition-all"
              title={isSubSidebarCollapsed ? "Expand Sub-Sidebar" : "Collapse Sub-Sidebar"}
            >
              {isSubSidebarCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>
          </div>

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

        {/* Quick actions inside sidebar footer */}
        <div className={`p-4 border-t transition-colors duration-300 dark:border-slate-800 border-slate-200 ${
          isSubSidebarCollapsed ? 'flex flex-col items-center gap-3' : 'space-y-2'
        }`}>
          {!isSubSidebarCollapsed ? (
            <button
              onClick={handleSave}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow transition-all"
            >
              <FolderHeart size={13} /> Save Config
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow"
              title="Save Template"
            >
              <FolderHeart size={13} />
            </button>
          )}
        </div>
      </aside>

      {/* Workspace content tab shell */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {activeSubTab === 'canvas' && (
          <PatternGenerator
            width={width} setWidth={setWidth}
            height={height} setHeight={setHeight}
            scale={scale} setScale={setScale}
            stroke={stroke} setStroke={setStroke}
            angle={angle} setAngle={setAngle}
            bg={bg} color1={color1} color2={color2}
            onInspireMe={handleInspireMe}
            onResetDefaults={handleResetDefaults}
            onSwapColors={handleSwapColors}
            keepActivePaletteLinked={keepActivePaletteLinked}
            setKeepActivePaletteLinked={setKeepActivePaletteLinked}
            encodedSvg={encodedSvg}
          />
        )}

        {activeSubTab === 'templates' && (
          <PatternExplorer
            patternTypes={PATTERN_TYPES}
            patternType={patternType}
            onLoadTemplate={handleLoadTemplate}
            onLoadCommunityPattern={handleLoadCommunityPattern}
            width={width} height={height} scale={scale} stroke={stroke}
            bg={bg} color1={color1} color2={color2}
            isPaletteImported={isPaletteImported}
          />
        )}

        {activeSubTab === 'palette' && (
          <PatternPalette
            activePalette={activePalette}
            onImportPalette={handleImportPaletteColors}
            onSwapColors={handleSwapColors}
            onRestoreDefaults={handleRestoreDefaultColors}
            isPaletteImported={isPaletteImported}
            bg={bg} setBg={setBg}
            color1={color1} setColor1={setColor1}
            color2={color2} setColor2={setColor2}
          />
        )}

        {activeSubTab === 'visualizer' && (
          <PatternVisualizer
            encodedSvg={encodedSvg}
            bg={bg}
            color1={color1}
            color2={color2}
          />
        )}

        {activeSubTab === 'export' && (
          <PatternExport
            fullSvg={fullSvg}
            cssBackgroundCode={cssBackgroundCode}
            patternType={patternType}
          />
        )}
      </main>
    </div>
  );
}
