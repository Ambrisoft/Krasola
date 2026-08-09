import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, Check, GripHorizontal } from 'lucide-react';
import { hexToHsl, hslToHex } from '../../utils/colorUtils';

export default function ColorWheelModal({ hex, onChangeHex, onClose }) {
  const canvasRef = useRef(null);
  const isDraggingWheelRef = useRef(false);
  const isDraggingPanelRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Initial center position on window viewport
  const [position, setPosition] = useState(() => ({
    x: Math.max(20, Math.round(window.innerWidth / 2 - 120)),
    y: Math.max(20, Math.round(window.innerHeight / 2 - 180))
  }));

  const hsl = hexToHsl(hex);
  const [currentH, setCurrentH] = useState(hsl.h);
  const [currentS, setCurrentS] = useState(hsl.s);
  const [currentL, setCurrentL] = useState(hsl.l);

  // Sync internal HSL when hex prop changes externally
  useEffect(() => {
    const updatedHsl = hexToHsl(hex);
    setCurrentH(updatedHsl.h);
    setCurrentS(updatedHsl.s);
    setCurrentL(updatedHsl.l);
  }, [hex]);

  // Render 360-degree HSL Color Wheel Canvas
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 6;

    ctx.clearRect(0, 0, width, height);

    // Render conic HSL gradient wheel
    for (let angle = 0; angle < 360; angle += 1.5) {
      const startAngle = ((angle - 1.5) * Math.PI) / 180;
      const endAngle = ((angle + 1.5) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `hsl(${angle}, 0%, ${currentL}%)`);
      gradient.addColorStop(1, `hsl(${angle}, 100%, ${currentL}%)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Outer subtle border
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw active handle indicator ring
    const handleAngle = (currentH * Math.PI) / 180;
    const handleDist = (currentS / 100) * radius;
    const hx = cx + Math.cos(handleAngle) * handleDist;
    const hy = cy + Math.sin(handleAngle) * handleDist;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.arc(hx, hy, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(hx, hy, 4.5, 0, 2 * Math.PI);
    ctx.fillStyle = hslToHex(currentH, currentS, currentL);
    ctx.fill();
  }, [currentH, currentS, currentL]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Convert mouse/touch position on canvas to Hue & Saturation
  const handlePointerInteraction = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const radius = Math.min(cx, cy) - 6;

    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let angleRad = Math.atan2(dy, dx);
    let angleDeg = Math.round((angleRad * 180) / Math.PI);
    if (angleDeg < 0) angleDeg += 360;

    const sat = Math.min(100, Math.max(0, Math.round((dist / radius) * 100)));

    setCurrentH(angleDeg);
    setCurrentS(sat);

    const newHex = hslToHex(angleDeg, sat, currentL);
    onChangeHex(newHex);
  }, [currentL, onChangeHex]);

  const handleWheelPointerDown = (e) => {
    e.stopPropagation();
    isDraggingWheelRef.current = true;
    handlePointerInteraction(e);
  };

  // Draggable Panel Header Handlers
  const handleHeaderPointerDown = (e) => {
    isDraggingPanelRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  };

  const handleGlobalPointerMove = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (isDraggingWheelRef.current) {
      handlePointerInteraction(e);
    } else if (isDraggingPanelRef.current) {
      setPosition({
        x: clientX - dragStartRef.current.x,
        y: clientY - dragStartRef.current.y
      });
    }
  }, [handlePointerInteraction]);

  const handleGlobalPointerUp = () => {
    isDraggingWheelRef.current = false;
    isDraggingPanelRef.current = false;
  };

  useEffect(() => {
    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [handleGlobalPointerMove]);

  const handleLightnessChange = (val) => {
    const lVal = parseInt(val);
    setCurrentL(lVal);
    const newHex = hslToHex(currentH, currentS, lVal);
    onChangeHex(newHex);
  };

  const activeHex = hslToHex(currentH, currentS, currentL);
  const textShadowStyle = { textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.95)' };

  const modalJSX = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`
      }}
      className="w-64 bg-slate-950/25 border border-white/25 rounded-3xl z-50 p-4 shadow-2xl backdrop-blur-2xl text-white flex flex-col items-center gap-3 select-none cursor-default"
    >
      {/* Draggable Header */}
      <div
        onPointerDown={handleHeaderPointerDown}
        className="w-full flex items-center justify-between border-b border-white/15 pb-2 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal size={14} className="text-slate-300 opacity-80" />
          <div style={{ backgroundColor: activeHex }} className="w-4 h-4 rounded-full border border-white/40 shadow" />
          <span 
            style={textShadowStyle}
            className="text-[10px] font-black uppercase tracking-wider text-white"
          >
            Adobe Color Wheel
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
          title="Close Panel"
        >
          <X size={12} />
        </button>
      </div>

      {/* 360-Degree Interactive Canvas Color Wheel */}
      <div className="relative cursor-crosshair select-none my-1">
        <canvas
          ref={canvasRef}
          width={180}
          height={180}
          onPointerDown={handleWheelPointerDown}
          className="touch-none rounded-full drop-shadow-md"
        />
      </div>

      {/* Lightness Slider */}
      <div className="w-full space-y-1 text-left">
        <div 
          style={textShadowStyle}
          className="flex justify-between text-[8px] font-black uppercase text-white tracking-wider"
        >
          <span>LIGHTNESS</span>
          <span>{currentL}%</span>
        </div>
        <input
          type="range"
          min="5"
          max="95"
          value={currentL}
          onChange={(e) => handleLightnessChange(e.target.value)}
          className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer drop-shadow-sm"
        />
      </div>

      {/* Active HEX Badge & Done Button */}
      <div className="w-full flex items-center justify-between pt-1">
        <span 
          style={textShadowStyle}
          className="text-xs font-black tracking-widest bg-black/40 border border-white/20 px-2.5 py-1 rounded-lg shadow-sm text-white"
        >
          {activeHex.toUpperCase()}
        </span>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-md transition-all"
        >
          <Check size={11} /> Done
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalJSX, document.body);
}
