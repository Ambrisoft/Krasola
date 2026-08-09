import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image as ImageIcon, Zap, AlertCircle, Link, FolderHeart, Sparkles, Move } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { rgbToHex, extractMMCQWithCoordinates, hexToHsl } from '../../utils/colorUtils';

export default function PaletteExtractor({ onLoadPalette, showToast }) {
  const { theme } = useTheme();
  const [imageSrc, setImageSrc] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [extractedColors, setExtractedColors] = useState([]);
  const [pinMarkers, setPinMarkers] = useState([]);
  const [colorCount, setColorCount] = useState(5);
  const [extractionMood, setExtractionMood] = useState('colorful');
  const [savedImagesList, setSavedImagesList] = useState([]);
  const [draggingMarkerIdx, setDraggingMarkerIdx] = useState(null);

  const fileInputRef = useRef(null);
  const imageContainerRef = useRef(null);
  const canvasBufferRef = useRef(null);
  const activeImgRef = useRef(null);

  // Load saved assets from Image Studio storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('saved_images');
      if (saved) {
        setSavedImagesList(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Failed to load saved_images in Extractor:', err);
    }
  }, []);

  // Adobe MMCQ Coordinate & Pin Marker Extraction Engine
  const runMMCQExtraction = useCallback((imgElement, count, mood) => {
    if (!imgElement) return;
    activeImgRef.current = imgElement;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = imgElement.naturalWidth || 300;
    const height = imgElement.naturalHeight || 300;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(imgElement, 0, 0, width, height);
    canvasBufferRef.current = { canvas, ctx, width, height };

    // Extract markers with spatial percentage coordinates
    const markers = extractMMCQWithCoordinates(ctx, width, height, count, mood);
    setPinMarkers(markers);
    setExtractedColors(markers.map(m => m.hex));
  }, []);

  // Mood selector change
  const handleMoodChange = (newMood) => {
    setExtractionMood(newMood);
    if (activeImgRef.current) {
      runMMCQExtraction(activeImgRef.current, colorCount, newMood);
      if (showToast) showToast(`Switched Adobe Mood to ${newMood.toUpperCase()}`);
    }
  };

  // Swatch count change
  const handleCountChange = (newCount) => {
    setColorCount(newCount);
    if (activeImgRef.current) {
      runMMCQExtraction(activeImgRef.current, newCount, extractionMood);
    }
  };

  // Process image object for file/url/vault
  const processImageSrc = (src, toastMsg) => {
    setImageSrc(src);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      runMMCQExtraction(img, colorCount, extractionMood);
      if (showToast) showToast(toastMsg);
    };
    img.src = src;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      processImageSrc(event.target.result, 'Extracted Adobe Color Mood palette from file!');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput) return;
    processImageSrc(urlInput, 'Extracted Adobe Color Mood palette from URL image!');
  };

  const handleSelectSavedAsset = (src) => {
    processImageSrc(src, 'Extracted Adobe Color Mood palette from Vault asset!');
  };

  // Pointer Dragging for Pin Markers on Image Canvas
  const handleMarkerPointerDown = (e, idx) => {
    e.stopPropagation();
    setDraggingMarkerIdx(idx);
  };

  const handleContainerPointerMove = (e) => {
    if (draggingMarkerIdx === null || !imageContainerRef.current || !canvasBufferRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Calculate relative percentage (0-100%)
    let xPct = ((clientX - rect.left) / rect.width) * 100;
    let yPct = ((clientY - rect.top) / rect.height) * 100;

    xPct = Math.min(96, Math.max(4, xPct));
    yPct = Math.min(96, Math.max(4, yPct));

    // Read pixel color from canvas buffer at target position
    const { ctx, width, height } = canvasBufferRef.current;
    const pxX = Math.min(width - 1, Math.max(0, Math.round((xPct / 100) * width)));
    const pxY = Math.min(height - 1, Math.max(0, Math.round((yPct / 100) * height)));

    const pixelData = ctx.getImageData(pxX, pxY, 1, 1).data;
    const pickedHex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);

    // Update marker coordinates and swatch color live at 60fps
    setPinMarkers(prev => prev.map((m, i) => i === draggingMarkerIdx ? { ...m, xPct, yPct, hex: pickedHex } : m));
    setExtractedColors(prev => prev.map((c, i) => i === draggingMarkerIdx ? pickedHex : c));
    setExtractionMood('none'); // Custom manual dragging mode
  };

  const handleContainerPointerUp = () => {
    setDraggingMarkerIdx(null);
  };

  useEffect(() => {
    window.addEventListener('pointerup', handleContainerPointerUp);
    return () => window.removeEventListener('pointerup', handleContainerPointerUp);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => processImageSrc(ev.target.result, 'Extracted Adobe palette from dropped image!');
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub header */}
      <div>
        <h3 className="text-lg font-bold tracking-tight">Extractor Studio</h3>
        <p className={`text-xs ${theme.textMuted}`}>Drop an image, paste a URL, or import from Image Studio to extract its dominant color profile.</p>
      </div>

      {/* URL Fetch Input Form */}
      <form onSubmit={handleUrlSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Link size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image web URL (https://...)..."
            className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
              theme.isDark 
                ? 'bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500' 
                : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
            }`}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
        >
          Extract URL
        </button>
      </form>

      {/* Saved Image Assets Quick Select Strip */}
      {savedImagesList.length > 0 && (
        <div className="space-y-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${theme.textMuted} flex items-center gap-1`}>
            <FolderHeart size={10} /> Saved Image Vault Assets:
          </span>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {savedImagesList.map((imgItem) => (
              <button
                key={imgItem.id}
                onClick={() => handleSelectSavedAsset(imgItem.url || imgItem.thumbnail)}
                className="w-16 h-12 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500 hover:scale-105 transition-all shrink-0 relative group"
                title={imgItem.title}
              >
                <img src={imgItem.thumbnail || imgItem.url} alt={imgItem.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Upload Zone & Clean Image Canvas with Spatial Pin Markers */}
        <div className="flex-1 space-y-4">
          <div
            ref={imageContainerRef}
            onPointerMove={handleContainerPointerMove}
            onPointerUp={handleContainerPointerUp}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`h-96 rounded-3xl border-2 ${
              imageSrc ? 'border-transparent bg-slate-950/20' : 'border-dashed border-slate-700/50 bg-slate-900/20'
            } flex items-center justify-center p-2 relative overflow-hidden backdrop-blur-xl transition-all select-none touch-none`}
          >
            {imageSrc ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Crisp 100% Opacity Image (No Faded Overlay, No Text Prompts) */}
                <img
                  src={imageSrc}
                  alt="Uploaded target asset"
                  className="w-full h-full object-contain rounded-2xl pointer-events-none select-none"
                />

                {/* Adobe Interactive Draggable Color Pin Markers */}
                {pinMarkers.map((marker, idx) => (
                  <div
                    key={idx}
                    onPointerDown={(e) => handleMarkerPointerDown(e, idx)}
                    style={{ left: `${marker.xPct}%`, top: `${marker.yPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-center z-30 transition-transform hover:scale-125 active:scale-95 touch-none"
                    title={`Pin Marker #${idx + 1}: ${marker.hex}`}
                  >
                    <div style={{ backgroundColor: marker.hex }} className="w-full h-full rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-white text-[10px] font-black" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95)' }}>
                        {idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-3 text-center cursor-pointer p-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Upload size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Drag and drop image here</h4>
                  <p className={`text-xs mt-1 ${theme.textMuted}`}>Supports PNG, JPEG, WEBP, or SVG files</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-md transition-all mt-2"
                >
                  Browse Files
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Adobe Extraction Mood Controls */}
          <div className={`p-4 border rounded-2xl space-y-3 ${theme.card}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                  <Sparkles size={13} className="text-indigo-400" /> Color Mood:
                </span>
                <select
                  value={extractionMood}
                  onChange={(e) => handleMoodChange(e.target.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-all cursor-pointer shadow-sm ${
                    theme.isDark 
                      ? 'bg-slate-800 border-slate-700 text-slate-200 focus:border-indigo-500' 
                      : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
                  }`}
                >
                  <option value="colorful">Colorful</option>
                  <option value="bright">Bright</option>
                  <option value="muted">Muted</option>
                  <option value="deep">Deep</option>
                  <option value="dark">Dark</option>
                  <option value="none">None (Custom Pin Dragging)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Colors:</span>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={colorCount}
                  onChange={(e) => handleCountChange(Number(e.target.value))}
                  className="w-28 accent-indigo-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                />
                <span className="text-xs font-bold bg-slate-500/10 px-2 py-0.5 rounded">{colorCount} Swatches</span>
              </div>
            </div>

            {/* Quick Mood Preset Buttons matching Adobe */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { id: 'colorful', label: 'Colorful' },
                { id: 'bright', label: 'Bright' },
                { id: 'muted', label: 'Muted' },
                { id: 'deep', label: 'Deep' },
                { id: 'dark', label: 'Dark' },
                { id: 'none', label: 'Custom' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMoodChange(m.id)}
                  className={`py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
                    extractionMood === m.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : theme.isDark
                        ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Extraction panel */}
        <div className="w-full lg:w-96 flex flex-col justify-between border rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 bg-slate-900/10 dark:bg-slate-950/20">
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <ImageIcon size={16} className="text-indigo-400" /> Extraction Results
            </h4>
            
            {extractedColors.length === 0 ? (
              <div className="h-48 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4">
                <AlertCircle size={24} className="text-slate-500 mb-2" />
                <p className="text-xs text-slate-400">No image uploaded yet. Upload an asset or paste a URL to preview swatches.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {extractedColors.map((color, idx) => (
                  <div
                    key={idx}
                    style={{ borderLeftColor: color }}
                    className="flex items-center justify-between p-3 rounded-xl border border-l-4 border-slate-200 dark:border-slate-800 bg-slate-500/5 hover:bg-slate-500/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div style={{ backgroundColor: color }} className="w-6 h-6 rounded-lg border border-black/10 shadow" />
                      <span className="text-xs font-bold tracking-wider">{color.toUpperCase()}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(color);
                        if (showToast) showToast(`Copied HEX: ${color.toUpperCase()}`);
                      }}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg ${
                        theme.isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-350' : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {extractedColors.length > 0 && (
            <button
              onClick={() => onLoadPalette(extractedColors)}
              className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Zap size={14} /> Load Palette into Generator
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
