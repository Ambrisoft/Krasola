import React, { useState } from 'react';
import { 
  Layout, Smartphone, Package, Palette, Check, Sparkles, Star, Sun, Moon, 
  Send, Users, Mail, Compass, HelpCircle, Monitor, Shield, Layers, CreditCard,
  Music, CloudRain, Award, BookOpen, Gift, Map, Heart, Bell
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PatternVisualizer({ encodedSvg, bg, color1, color2 }) {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('web');
  const [patternOpacity, setPatternOpacity] = useState(0.12);

  const categories = [
    { id: 'web', label: '🖥️ SaaS & Web (10)', icon: Monitor },
    { id: 'mobile', label: '📱 Mobile Views (10)', icon: Smartphone },
    { id: 'packaging', label: '📦 Packaging & Mockups (10)', icon: Package },
    { id: 'decor', label: '🎨 Art & Wallpaper (10)', icon: Palette }
  ];

  const patternStyle = {
    backgroundImage: `url("data:image/svg+xml;utf8,${encodedSvg}")`,
    opacity: patternOpacity
  };

  const cardStyle = `relative p-5 rounded-2xl border transition-all duration-300 shadow-xl overflow-hidden ${
    theme.isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
  }`;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Pattern Visualizer Arena (40 Previews)</h3>
          <p className={`text-xs ${theme.textMuted}`}>Preview the active SVG pattern layout mapped onto 40 realistic component templates.</p>
        </div>

        {/* Global Pattern Opacity Slider */}
        <div className="flex items-center gap-3 bg-slate-500/10 p-2 rounded-xl shrink-0 text-xs font-bold">
          <span>Pattern Ambient Opacity:</span>
          <input
            type="range" min="0.02" max="0.5" step="0.01" value={patternOpacity}
            onChange={(e) => setPatternOpacity(parseFloat(e.target.value))}
            className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="font-mono w-8">{(patternOpacity * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Category Tab Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b dark:border-slate-800 border-slate-200">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : theme.isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon size={12} /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* CATEGORY 1: SAAS & WEB SECTIONS */}
        {activeCategory === 'web' && (
          <>
            {/* 1. Hero Landing Page Banner */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 space-y-2">
                <span style={{ color: color1 }} className="text-[9px] font-black uppercase tracking-wider">NEXT-GEN PLATFORM</span>
                <h4 className="text-sm font-black tracking-tight leading-tight">
                  Design interfaces with <span style={{ color: color2 }} className="underline">ambient textures</span>
                </h4>
                <p className="text-[9px] opacity-75">Scale vector geometry cleanly across any screen layout width.</p>
                <div className="flex gap-2 pt-1">
                  <button style={{ backgroundColor: color1 }} className="px-2.5 py-1 text-white text-[8px] font-bold rounded-lg">Get Started</button>
                  <button className="px-2.5 py-1 border border-current text-[8px] font-bold rounded-lg bg-transparent">Learn More</button>
                </div>
              </div>
            </div>

            {/* 2. Dashboard Sidebar */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 flex gap-4 h-32">
                <div className="w-1/3 border-r dark:border-slate-800 border-slate-200 pr-2 space-y-1.5 text-[8px]">
                  <div className="font-black opacity-60">CONSOLE</div>
                  <div style={{ color: color1 }} className="font-bold flex items-center gap-1">● Dashboard</div>
                  <div className="opacity-70">Projects</div>
                  <div className="opacity-70">Integrations</div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <span className="text-[10px] font-bold">Active Workspace</span>
                  <div className="p-2 rounded-xl bg-slate-500/10 text-[9px] font-bold">Server status: OK</div>
                </div>
              </div>
            </div>

            {/* 3. Pricing Tier Card */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase opacity-65">ENTERPRISE</span>
                  <span style={{ backgroundColor: color1 }} className="px-1.5 py-0.5 text-[7px] font-bold text-white rounded">POPULAR</span>
                </div>
                <div className="text-lg font-black font-mono">$199<span className="text-xs font-normal">/mo</span></div>
                <button style={{ backgroundColor: color1 }} className="w-full py-1 text-white text-[8px] font-bold rounded-lg">Buy Enterprise</button>
              </div>
            </div>

            {/* 4. Login Portal Modal */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 space-y-2 max-w-xs mx-auto text-center">
                <h4 className="text-[10px] font-black uppercase">Sign In to Dashboard</h4>
                <input type="text" placeholder="Email Address" className="w-full text-[8px] p-1.5 rounded border border-slate-500/20 bg-slate-500/5" />
                <button style={{ backgroundColor: color2 }} className="w-full py-1 text-white text-[8px] font-bold rounded">Continue</button>
              </div>
            </div>

            {/* 5. Customer Testimonial Card */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 space-y-2">
                <div className="flex gap-0.5 text-amber-400"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></div>
                <p className="text-[9px] italic opacity-85">"The pattern integration toolkit transformed our website backgrounds completely!"</p>
                <div className="text-[8px] font-bold">— Director of Engineering, Airbnb</div>
              </div>
            </div>

            {/* 6. Newsletter Signup Banner */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 space-y-1">
                <h4 className="text-[10px] font-black">Stay updated on UI releases</h4>
                <div className="flex gap-1">
                  <input type="email" placeholder="email@address.com" className="w-full text-[8px] p-1.5 rounded bg-slate-500/10 border border-slate-500/25" />
                  <button style={{ backgroundColor: color1 }} className="px-3 text-white text-[8px] font-bold rounded">Join</button>
                </div>
              </div>
            </div>

            {/* 7. Feature Grid Card */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 space-y-2">
                <div style={{ color: color1 }}><Sparkles size={16} /></div>
                <h4 className="text-[10px] font-black">Vector Scalability</h4>
                <p className="text-[9px] opacity-70">Fully responsive geometric tiles render at any size without performance lag.</p>
              </div>
            </div>

            {/* 8. Section Wave Divider */}
            <div className={cardStyle}>
              <div className="absolute inset-x-0 bottom-0 h-10 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 text-[9px] space-y-1">
                <span className="font-bold uppercase opacity-60">Layout Division</span>
                <p className="opacity-80">Subtle pattern divider separates hero banner sections dynamically.</p>
              </div>
            </div>

            {/* 9. Alert Notification Banner */}
            <div className={cardStyle} style={{ borderColor: `${color2}40` }}>
              <div className="absolute inset-0 z-0 pointer-events-none opacity-5" style={{ ...patternStyle, opacity: 0.05 }} />
              <div className="relative z-10 flex items-center gap-3">
                <div style={{ color: color2 }} className="font-bold text-xs">⚠️ Warning</div>
                <p className="text-[8px] opacity-80">Security patch patch-4981 needs server node deployment.</p>
              </div>
            </div>

            {/* 10. Profile Cover Photo Card */}
            <div className={cardStyle}>
              <div className="absolute inset-x-0 top-0 h-12 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.2 }} />
              <div className="relative z-10 pt-6 flex items-center gap-3">
                <div style={{ backgroundColor: color1 }} className="w-10 h-10 rounded-full border border-white/20 text-white font-bold text-[10px] flex items-center justify-center">MK</div>
                <div><div className="text-[9px] font-bold">Marcus K.</div><div className="text-[7px] opacity-60">Senior UI Architect</div></div>
              </div>
            </div>
          </>
        )}

        {/* CATEGORY 2: MOBILE APP VIEWS */}
        {activeCategory === 'mobile' && (
          <>
            {/* 1. App Onboarding Slider */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 space-y-2 max-w-xs mx-auto text-center pt-2">
                <span className="text-[8px] font-bold uppercase opacity-60">STEP 1 OF 3</span>
                <h4 className="text-[11px] font-black">Organize Vector Patterns</h4>
                <p className="text-[8px] opacity-75">Connect HSL active color palettes with standard repeats.</p>
              </div>
            </div>

            {/* 2. Premium Subscription Paywall */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 space-y-3 text-center">
                <h4 className="text-[10px] font-black uppercase text-amber-400">JOIN PREMIUM</h4>
                <div className="text-lg font-mono font-black">$4.99<span className="text-[10px] font-normal">/mo</span></div>
                <button style={{ backgroundColor: color1 }} className="w-full py-1 text-white text-[8px] font-bold rounded">Subscribe Now</button>
              </div>
            </div>

            {/* 3. Lock Screen Wallpaper */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.18 }} />
              <div className="relative z-10 flex flex-col justify-between h-32">
                <div className="text-center font-mono"><div className="text-xl font-bold">10:42 AM</div><div className="text-[7px] opacity-60">Saturday, August 8</div></div>
                <div className="text-[7px] text-center opacity-70">Swipe up to unlock device</div>
              </div>
            </div>

            {/* 4. Subtle Chat Backdrop */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.06 }} />
              <div className="relative z-10 space-y-1.5 text-[8px]">
                <div className="p-1.5 rounded-2xl max-w-[75%] bg-slate-500/10">How does the background pattern look on mobile?</div>
                <div style={{ backgroundColor: color1 }} className="p-1.5 rounded-2xl max-w-[75%] ml-auto text-white font-bold">Incredibly clean! Very subtle.</div>
              </div>
            </div>

            {/* 5. Credit Card Wallet Badge */}
            <div className={cardStyle}>
              <div style={{ backgroundColor: color1 }} className="p-4 rounded-xl text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20" style={patternStyle} />
                <div className="relative z-10 space-y-3 font-mono">
                  <div className="flex justify-between text-[8px]"><span>DesignCard</span><span>VISA</span></div>
                  <div className="text-xs pt-1">•••• •••• •••• 9012</div>
                </div>
              </div>
            </div>

            {/* 6. Music Player Mesh */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 flex items-center gap-3">
                <div style={{ backgroundColor: color2 }} className="w-10 h-10 rounded-xl flex items-center justify-center text-white"><Music size={16} /></div>
                <div><div className="text-[10px] font-bold">Cyber Ambient Wave</div><div className="text-[7px] opacity-60">Techno Horizon</div></div>
              </div>
            </div>

            {/* 7. Settings Sidebar Panel */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 space-y-1 text-[8px]">
                <div className="p-2 rounded bg-slate-500/10 font-bold flex justify-between"><span>Wi-Fi Network</span><span style={{ color: color1 }}>Connected</span></div>
                <div className="p-2 rounded bg-slate-500/10 font-bold">Display Settings</div>
              </div>
            </div>

            {/* 8. Weather Widget Banner */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 flex justify-between items-center text-[10px] font-bold">
                <div><div>74°F Cloudy</div><div className="opacity-60 text-[7px]">Precipitation: 10%</div></div>
                <CloudRain size={20} className="text-indigo-400" />
              </div>
            </div>

            {/* 9. Achievements Grid */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 flex gap-2">
                <div className="flex-1 p-2 rounded bg-slate-500/10 text-center"><Award size={14} className="mx-auto" style={{ color: color1 }} /><span className="text-[7px] font-bold">Level 10</span></div>
                <div className="flex-1 p-2 rounded bg-slate-500/10 text-center"><Award size={14} className="mx-auto" style={{ color: color2 }} /><span className="text-[7px] font-bold">Top 1%</span></div>
              </div>
            </div>

            {/* 10. App Dock Wallpaper */}
            <div className={cardStyle}>
              <div className="absolute inset-x-0 bottom-0 h-10 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 flex justify-around pt-6"><div className="w-6 h-6 rounded bg-slate-500/20" /><div className="w-6 h-6 rounded bg-slate-500/20" /><div className="w-6 h-6 rounded bg-slate-500/20" /></div>
            </div>
          </>
        )}

        {/* CATEGORY 3: PACKAGING & MOCKUPS */}
        {activeCategory === 'packaging' && (
          <>
            {/* 1. Premium Business Card */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.18 }} />
              <div className="relative z-10 flex flex-col justify-between h-32">
                <div><h4 className="text-xs font-black uppercase">KRASOLA INC.</h4><span className="text-[7px] opacity-60">Unified Color & Vector Solutions</span></div>
                <div className="text-[7px] font-mono">marcus@krasola.io • www.krasola.io</div>
              </div>
            </div>

            {/* 2. Cryptocurrency Asset Card */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 space-y-1">
                <span className="text-[8px] font-bold opacity-60">Total Balance</span>
                <h4 className="text-base font-black font-mono">0.4281 BTC</h4>
                <div className="text-[8px] font-bold" style={{ color: color2 }}>$27,842.10 USD (+1.8%)</div>
              </div>
            </div>

            {/* 3. Corporate Gift Box */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-indigo-500/5" style={{ ...patternStyle, opacity: 0.22 }} />
              <div className="relative z-10 text-center space-y-2 py-3 border border-dashed border-slate-500/20 rounded-xl">
                <span className="text-[8px] font-black uppercase tracking-wider">BOX PACKAGING WRAP</span>
                <div className="mx-auto w-10 h-10 border border-current rounded flex items-center justify-center"><Gift size={16} /></div>
              </div>
            </div>

            {/* 4. Apparel Fabric Texture */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.3 }} />
              <div className="relative z-10 space-y-1 bg-slate-900/60 p-2 rounded text-white text-[8px] font-bold text-center">
                <span>COTTON POLYESTER BLEND</span>
              </div>
            </div>

            {/* 5. Book Jacket Cover */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.15 }} />
              <div className="relative z-10 flex flex-col justify-between h-32 text-center">
                <h4 className="text-xs font-black">THE GEOMETRIC WAVE</h4>
                <span className="text-[7px] opacity-70">A Study in Repeating Mathematics</span>
              </div>
            </div>

            {/* 6. Mobile Phone Skin Wrap */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.25 }} />
              <div className="relative z-10 border border-slate-500/20 rounded-xl p-3 text-center text-[7px] font-bold">
                <span>REAR MATTE SKIN PREVIEW</span>
              </div>
            </div>

            {/* 7. Premium Letter Envelope */}
            <div className={cardStyle}>
              <div className="absolute inset-x-0 top-0 h-10 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 pt-8 text-[7px] font-mono">
                <span>INSIDE LINER PATTERN PREVIEW</span>
              </div>
            </div>

            {/* 8. Product Label Sticker */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 bg-slate-950/80 p-3 rounded-lg text-white text-center space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-widest text-amber-400">ORGANIC BEVERAGE</span>
                <div className="text-[7px] opacity-60">12 FL OZ (355ML)</div>
              </div>
            </div>

            {/* 9. Beverage Sleeve Wrap */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.2 }} />
              <div className="relative z-10 p-2 text-center text-[8px] font-black uppercase">
                <span>BEVERAGE CARDBOARD SLEEVE</span>
              </div>
            </div>

            {/* 10. Concert Ticket Backdrop */}
            <div className={cardStyle}>
              <div className="absolute inset-x-0 right-0 w-12 z-0 pointer-events-none" style={patternStyle} />
              <div className="relative z-10 flex justify-between items-center text-[8px] font-mono">
                <div><div>ADMIT ONE</div><div className="opacity-60">Gate 4 • Row H</div></div>
              </div>
            </div>
          </>
        )}

        {/* CATEGORY 4: ART & WALLPAPER */}
        {activeCategory === 'decor' && (
          <>
            {/* 1. Abstract Memphis Canvas */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.35 }} />
              <div className="relative z-10 text-xs font-bold text-center py-8">MEMPHIS DESIGN CANVAS</div>
            </div>

            {/* 2. Cyberpunk Grid Scene */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.3 }} />
              <div className="relative z-10 text-xs font-bold text-center py-8">CYBERPUNK NEON GRID</div>
            </div>

            {/* 3. Zen Bamboo Screen */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.25 }} />
              <div className="relative z-10 text-xs font-bold text-center py-8">ZEN BAMBOO SCREEN</div>
            </div>

            {/* 4. Honeycomb Dashboard */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.2 }} />
              <div className="relative z-10 text-xs font-bold text-center py-8">HONEYCOMB HEX GRID</div>
            </div>

            {/* 5. Moroccan Tapestry Banner */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.28 }} />
              <div className="relative z-10 text-xs font-bold text-center py-8">MOROCCAN TAPESTRY</div>
            </div>

            {/* 6. Stellar Stardust Constellation */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.18 }} />
              <div className="relative z-10 text-xs font-bold text-center py-8">CONSTELLATION MAP</div>
            </div>

            {/* 7. Psychedelic Waves */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.22 }} />
              <div className="relative z-10 text-xs font-bold text-center py-8">PSYCHEDELIC RIPPLES</div>
            </div>

            {/* 8. Tech Node Mesh */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.3 }} />
              <div className="relative z-10 text-xs font-bold text-center py-8">TECH NODE MESH</div>
            </div>

            {/* 9. Apparel Chevron Block */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.2 }} />
              <div className="relative z-10 text-xs font-bold text-center py-8">CHEVRON ZIGZAG WEAVE</div>
            </div>

            {/* 10. Halftone Dots Wall */}
            <div className={cardStyle}>
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ ...patternStyle, opacity: 0.25 }} />
              <div className="relative z-10 text-xs font-bold text-center py-8">HALFTONE DOTS CANVAS</div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
