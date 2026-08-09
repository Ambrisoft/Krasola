import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, Check, Sliders, GripHorizontal } from 'lucide-react';
import { hexToHsl, hslToHex } from '../../utils/colorUtils';

export default function HslAdjusterModal({ hex, onChangeHex, onClose }) {
  const isDraggingPanelRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Initial center position on window viewport
  const [position, setPosition] = useState(() => ({
    x: Math.max(20, Math.round(window.innerWidth / 2 - 120)),
    y: Math.max(20, Math.round(window.innerHeight / 2 - 140))
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
    if (!isDraggingPanelRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStartRef.current.x,
      y: clientY - dragStartRef.current.y
    });
  }, []);

  const handleGlobalPointerUp = () => {
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

  // Update specific HSL channel
  const handleHslChange = (channel, val) => {
    const numVal = parseInt(val);
    let newH = currentH;
    let newS = currentS;
    let newL = currentL;

    if (channel === 'h') {
      newH = numVal;
      setCurrentH(numVal);
    } else if (channel === 's') {
      newS = numVal;
      setCurrentS(numVal);
    } else if (channel === 'l') {
      newL = numVal;
      setCurrentL(numVal);
    }

    const newHex = hslToHex(newH, newS, newL);
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
      className="w-64 bg-slate-950/20 border border-white/20 rounded-3xl z-50 p-4 shadow-2xl backdrop-blur-2xl text-white flex flex-col gap-3 select-none cursor-default"
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
            className="text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1"
          >
            <Sliders size={10} /> HSL Fine-Tuner
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

      {/* HSL Sliders */}
      <div className="space-y-2.5 text-left">
        {/* Hue */}
        <div>
          <div 
            style={textShadowStyle}
            className="flex justify-between text-[8px] font-black uppercase text-white tracking-wider"
          >
            <span>HUE</span>
            <span>{currentH}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={currentH}
            onChange={(e) => handleHslChange('h', e.target.value)}
            className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer drop-shadow-sm"
          />
        </div>

        {/* Saturation */}
        <div>
          <div 
            style={textShadowStyle}
            className="flex justify-between text-[8px] font-black uppercase text-white tracking-wider"
          >
            <span>SATURATION</span>
            <span>{currentS}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={currentS}
            onChange={(e) => handleHslChange('s', e.target.value)}
            className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer drop-shadow-sm"
          />
        </div>

        {/* Lightness */}
        <div>
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
            onChange={(e) => handleHslChange('l', e.target.value)}
            className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer drop-shadow-sm"
          />
        </div>
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
