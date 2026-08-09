import React, { useState, useRef, useEffect } from 'react';
import { Sliders, RotateCw, FlipHorizontal, FlipVertical, Crop, Type, Download, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getCanvasFilterString } from './imageUtils';

export default function ImageEditorCanvas({ selectedImage }) {
  const { theme } = useTheme();
  const canvasRef = useRef(null);

  // Filter States
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [sepia, setSepia] = useState(0);

  // Transform States
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Overlay text state
  const [watermarkText, setWatermarkText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');

  // Render processed image onto Canvas
  useEffect(() => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      // Dimensions
      const w = img.naturalWidth || 800;
      const h = img.naturalHeight || 600;

      canvas.width = rotation % 180 === 0 ? w : h;
      canvas.height = rotation % 180 === 0 ? h : w;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Filters
      ctx.filter = getCanvasFilterString({ brightness, contrast, saturation, blur, hue, sepia });
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();

      // Draw Watermark Overlay if specified
      if (watermarkText) {
        ctx.save();
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = textColor;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.fillText(watermarkText, 20, canvas.height - 30);
        ctx.restore();
      }
    };

    img.src = selectedImage.url;
  }, [selectedImage, brightness, contrast, saturation, blur, hue, sepia, rotation, flipH, flipV, watermarkText, textColor]);

  // Reset controls
  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setHue(0);
    setSepia(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setWatermarkText('');
  };

  // Download edited image
  const handleDownload = (format = 'image/png', ext = 'png') => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL(format);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `edited_${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!selectedImage) {
    return (
      <div className={`p-12 text-center rounded-2xl border ${theme.card} space-y-3`}>
        <Sliders size={36} className="mx-auto text-slate-400 opacity-60" />
        <h4 className="font-bold text-sm">No image selected for photo editing</h4>
        <p className={`text-xs ${theme.textMuted}`}>Select an image from the Search Hub to adjust brightness, contrast, rotation, and overlays.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Editor Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b dark:border-slate-800 border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
            <Sliders className="text-indigo-400" size={18} /> Canvas Editor Studio
          </h3>
          <p className={`text-xs ${theme.textMuted}`}>Real-time 60fps HTML5 Canvas filter pipeline & transformations.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              theme.isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Reset Filters
          </button>
          <button
            onClick={() => handleDownload('image/png', 'png')}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
          >
            <Download size={14} /> Download PNG
          </button>
        </div>
      </div>

      {/* Editor Layout: Canvas View vs Sliders Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Display View */}
        <div className={`lg:col-span-2 rounded-2xl border p-4 flex items-center justify-center bg-slate-950 overflow-hidden relative min-h-[350px] ${theme.card}`}>
          <canvas ref={canvasRef} className="max-w-full max-h-[450px] object-contain rounded-lg shadow-2xl" />
        </div>

        {/* Adjustments Panel */}
        <div className={`rounded-2xl border p-5 space-y-5 ${theme.card}`}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Image Adjustments</h4>

          {/* Sliders */}
          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Brightness</span>
                <span className="text-indigo-400 font-mono">{brightness}%</span>
              </div>
              <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Contrast</span>
                <span className="text-indigo-400 font-mono">{contrast}%</span>
              </div>
              <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Saturation</span>
                <span className="text-indigo-400 font-mono">{saturation}%</span>
              </div>
              <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Hue Rotate</span>
                <span className="text-indigo-400 font-mono">{hue}°</span>
              </div>
              <input type="range" min="0" max="360" value={hue} onChange={(e) => setHue(Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Blur</span>
                <span className="text-indigo-400 font-mono">{blur}px</span>
              </div>
              <input type="range" min="0" max="20" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
            </div>
          </div>

          <hr className={theme.border} />

          {/* Transformations & Watermark */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Transformations</h5>
            <div className="flex gap-2">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  theme.isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
                }`}
              >
                <RotateCw size={13} /> Rotate 90°
              </button>
              <button
                onClick={() => setFlipH(!flipH)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  flipH ? 'bg-indigo-600 text-white border-indigo-500' : theme.isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <FlipHorizontal size={13} /> Flip H
              </button>
            </div>

            {/* Text Overlay */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold flex items-center gap-1">
                <Type size={13} className="text-indigo-400" /> Watermark Overlay
              </span>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text..."
                className={`w-full px-3 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none ${
                  theme.isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
