import React, { useState } from 'react';
import { 
  Layout, Smartphone, FileText, BarChart3, ShoppingBag, Component, 
  Bell, Check, Sparkles, Send, Star, Sun, Moon, TrendingUp, PieChart, 
  Tag, ShoppingCart, Layers, Type, CreditCard, ShieldCheck, Users,
  Server, Activity, CheckSquare, Clock, Filter, AlertTriangle, Info,
  HelpCircle, Mail, MapPin, DollarSign, Award, ChevronRight, Zap,
  Download, Eye, Heart, Lock, Sliders, ToggleLeft, MessageSquare, Flame
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getPaletteRoleMapping } from '../../utils/colorUtils';

export default function PaletteVisualizer({ colors = [] }) {
  const { theme } = useTheme();
  const [previewMode, setPreviewMode] = useState('dark');
  const [activeCategory, setActiveCategory] = useState('saas');
  const [selectedProductVariant, setSelectedProductVariant] = useState(0);

  const isLight = previewMode === 'light';
  const role = getPaletteRoleMapping(colors, !isLight);
  const swatches = role.swatches;

  const c0 = role.primary;
  const c1 = role.secondary;
  const c2 = role.accent;
  const c3 = role.highlight;
  const c4 = role.warning;

  const categories = [
    { id: 'saas', label: '📊 SaaS Dashboard (10)' },
    { id: 'mobile', label: '📱 Mobile App (10)' },
    { id: 'landing', label: '🌐 Landing Page (10)' },
    { id: 'charts', label: '📈 Data Charts (10)' },
    { id: 'ecommerce', label: '🛍️ E-Commerce (10)' },
    { id: 'designSystem', label: '📐 Design System (10)' }
  ];

  const cardStyle = `p-5 rounded-2xl border transition-all duration-300 shadow-xl ${
    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
  }`;

  return (
    <div className="space-y-6">
      {/* Sub Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Visualizer Arena (60 Previews)</h3>
          <p className={`text-xs ${theme.textMuted}`}>Comprehensive preview engine testing your color palette dynamically across 60 component mockups.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-500/10 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setPreviewMode('dark')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              previewMode === 'dark' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon size={12} /> Dark UI
          </button>
          <button
            onClick={() => setPreviewMode('light')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              previewMode === 'light' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun size={12} /> Light UI
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b dark:border-slate-800 border-slate-200">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md'
                : theme.isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of 10 Previews for Selected Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* CATEGORY 1: SAAS DASHBOARD (10 PREVIEWS) */}
        {activeCategory === 'saas' && (
          <>
            {/* 1. Analytics Card */}
            <div className={cardStyle}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1"><Layout size={12} /> Analytics Revenue</span>
                <span style={{ color: c1 }} className="text-[9px] font-bold px-2 py-0.5 rounded border border-current">Active</span>
              </div>
              <h3 className="text-2xl font-black font-mono">$18,492.50</h3>
              <span style={{ color: c2 }} className="text-[10px] font-bold">+24.8% vs last month</span>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[8px] font-bold opacity-70"><span>Development</span><span>75%</span></div>
                <div className="h-1.5 w-full bg-slate-500/20 rounded-full overflow-hidden">
                  <div style={{ width: '75%', backgroundColor: c0 }} className="h-full rounded-full" />
                </div>
              </div>
            </div>

            {/* 2. User Data Table */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1 mb-3"><Users size={12} /> Team Members</span>
              <div className="space-y-2">
                {[
                  { name: 'Alex Rivera', role: 'Lead Architect', tag: 'Admin', color: c0 },
                  { name: 'Sarah Chen', role: 'UX Designer', tag: 'Editor', color: c1 },
                  { name: 'David Kim', role: 'DevOps Lead', tag: 'Owner', color: c2 }
                ].map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-500/10 text-[9px]">
                    <div className="flex items-center gap-2">
                      <div style={{ backgroundColor: u.color }} className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[8px]">{u.name[0]}</div>
                      <div><div className="font-bold">{u.name}</div><div className="opacity-60">{u.role}</div></div>
                    </div>
                    <span style={{ backgroundColor: `${u.color}25`, color: u.color }} className="px-2 py-0.5 rounded font-bold">{u.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Server Health Monitor */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1 mb-3"><Server size={12} /> Server Cluster Health</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                  <div style={{ color: c2 }} className="text-lg font-black font-mono">99.98%</div>
                  <span className="text-[8px] font-bold opacity-60">Uptime Rate</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                  <div style={{ color: c0 }} className="text-lg font-black font-mono">14ms</div>
                  <span className="text-[8px] font-bold opacity-60">Avg Latency</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[9px]">
                <span className="opacity-70">Region: us-east-1</span>
                <span style={{ backgroundColor: c2, color: '#fff' }} className="px-2 py-0.5 rounded font-black text-[8px]">OPERATIONAL</span>
              </div>
            </div>

            {/* 4. Billing Plan Cards */}
            <div className={cardStyle}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase opacity-60">PRO PLAN</span>
                <span style={{ backgroundColor: c0 }} className="px-2 py-0.5 text-[8px] font-bold text-white rounded">POPULAR</span>
              </div>
              <div className="text-xl font-black font-mono mb-2">$49<span className="text-xs font-normal opacity-60">/mo</span></div>
              <div className="space-y-1 text-[9px]">
                <div className="flex items-center gap-1"><Check size={10} style={{ color: c2 }} /> Unlimited Projects</div>
                <div className="flex items-center gap-1"><Check size={10} style={{ color: c2 }} /> API Access & Webhooks</div>
              </div>
              <button style={{ backgroundColor: c0 }} className="w-full mt-3 py-1.5 text-[9px] font-bold text-white rounded-lg shadow">Upgrade Plan</button>
            </div>

            {/* 5. Activity Log Feed */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1 mb-3"><Activity size={12} /> Audit Activity</span>
              <div className="space-y-2 text-[9px]">
                <div className="flex items-center gap-2 border-l-2 pl-2" style={{ borderColor: c0 }}>
                  <div className="font-bold">Deployment #402 Success</div>
                  <span className="ml-auto opacity-50 text-[7px]">2m ago</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 pl-2" style={{ borderColor: c1 }}>
                  <div className="font-bold">API Token Regenerated</div>
                  <span className="ml-auto opacity-50 text-[7px]">15m ago</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 pl-2" style={{ borderColor: c3 }}>
                  <div className="font-bold">Database Backup Created</div>
                  <span className="ml-auto opacity-50 text-[7px]">1h ago</span>
                </div>
              </div>
            </div>

            {/* 6. Kanban Board Tile */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1 mb-2"><Sliders size={12} /> Deal Pipeline</span>
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-slate-500/10 border-l-4" style={{ borderColor: c0 }}>
                  <div className="text-[9px] font-bold">Acme Corp Enterprise</div>
                  <div className="text-[8px] opacity-60">$45,000 • In Progress</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-500/10 border-l-4" style={{ borderColor: c2 }}>
                  <div className="text-[9px] font-bold">Starlight Tech Deal</div>
                  <div className="text-[8px] opacity-60">$12,500 • Won</div>
                </div>
              </div>
            </div>

            {/* 7. Support Ticket Queue */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1 mb-2"><HelpCircle size={12} /> Support Tickets</span>
              <div className="space-y-1.5 text-[9px]">
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-500/10">
                  <span>#1082 SSO Auth Error</span>
                  <span style={{ backgroundColor: `${c4}25`, color: c4 }} className="px-1.5 py-0.5 rounded text-[7px] font-black">HIGH</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-500/10">
                  <span>#1083 Export Format Issue</span>
                  <span style={{ backgroundColor: `${c3}25`, color: c3 }} className="px-1.5 py-0.5 rounded text-[7px] font-black">MED</span>
                </div>
              </div>
            </div>

            {/* 8. Storage Capacity Gauge */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Storage Quota</span>
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                <span>78.4 GB used</span>
                <span className="opacity-60">100 GB</span>
              </div>
              <div className="h-2 w-full bg-slate-500/20 rounded-full overflow-hidden">
                <div style={{ width: '78%', backgroundColor: c0 }} className="h-full rounded-full" />
              </div>
            </div>

            {/* 9. Notification Drawer */}
            <div className={cardStyle}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1"><Bell size={10} /> Notifications</span>
                <span style={{ backgroundColor: c0 }} className="w-2 h-2 rounded-full" />
              </div>
              <p className="text-[9px] opacity-80">New security patch v2.4 released. Please update server nodes.</p>
            </div>

            {/* 10. Executive Scorecard */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Executive KPI Scorecard</span>
              <div className="grid grid-cols-3 gap-1 text-center font-mono">
                <div className="p-2 rounded bg-slate-500/10"><div style={{ color: c0 }} className="font-bold text-xs">840</div><div className="text-[7px] opacity-60">MRR</div></div>
                <div className="p-2 rounded bg-slate-500/10"><div style={{ color: c1 }} className="font-bold text-xs">12.4K</div><div className="text-[7px] opacity-60">Users</div></div>
                <div className="p-2 rounded bg-slate-500/10"><div style={{ color: c2 }} className="font-bold text-xs">94%</div><div className="text-[7px] opacity-60">CSAT</div></div>
              </div>
            </div>
          </>
        )}

        {/* CATEGORY 2: MOBILE APP (10 PREVIEWS) */}
        {activeCategory === 'mobile' && (
          <>
            {/* 1. Social Feed Card */}
            <div className={cardStyle}>
              <div className="flex items-center gap-2 mb-2">
                <div style={{ backgroundColor: c0 }} className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-[9px]">JD</div>
                <div><div className="text-[10px] font-bold">Jane Doe</div><div className="text-[7px] opacity-50">2h ago</div></div>
              </div>
              <p className="text-[9px] leading-snug mb-2">Building modern UI interfaces with dynamic color palettes!</p>
              <div className="flex gap-3 text-[8px] opacity-70"><span style={{ color: c0 }} className="font-bold">♥ 142 Likes</span><span>💬 28 Comments</span></div>
            </div>

            {/* 2. Chat Bubble View */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Chat Thread</span>
              <div className="space-y-2 text-[9px]">
                <div className="p-2 rounded-2xl max-w-[80%] bg-slate-500/20">Hey! Check out this palette!</div>
                <div style={{ backgroundColor: c0 }} className="p-2 rounded-2xl max-w-[80%] ml-auto text-white font-bold">Looks incredible! Perfect contrast.</div>
              </div>
            </div>

            {/* 3. Fitness Step Counter */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Fitness Tracker</span>
              <div className="flex items-center justify-between">
                <div><div className="text-xl font-black font-mono">8,420</div><div className="text-[8px] opacity-60">Steps Today</div></div>
                <div style={{ borderColor: c2 }} className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-[9px]">84%</div>
              </div>
            </div>

            {/* 4. Digital Wallet Card */}
            <div className={cardStyle}>
              <div style={{ backgroundColor: c0 }} className="p-4 rounded-2xl text-white space-y-2 shadow-lg">
                <div className="flex justify-between text-[8px] uppercase font-bold tracking-widest"><span>DesignCard</span><span>VISA</span></div>
                <div className="text-sm font-mono tracking-wider pt-1">•••• •••• •••• 4821</div>
                <div className="flex justify-between text-[8px]"><span>BAL: $4,920.00</span><span>12/28</span></div>
              </div>
            </div>

            {/* 5. Music Player */}
            <div className={cardStyle}>
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: c1 }} className="w-10 h-10 rounded-xl flex items-center justify-center text-white"><Zap size={16} /></div>
                <div><div className="text-[10px] font-bold">Midnight Synthwave</div><div className="text-[8px] opacity-60">Neon Horizons</div></div>
              </div>
              <div className="mt-3 h-1 w-full bg-slate-500/20 rounded-full overflow-hidden">
                <div style={{ width: '60%', backgroundColor: c0 }} className="h-full rounded-full" />
              </div>
            </div>

            {/* 6. Weather Widget */}
            <div className={cardStyle}>
              <div className="flex justify-between items-center">
                <div><div className="text-2xl font-black font-mono">72°F</div><div className="text-[8px] opacity-60">San Francisco • Sunny</div></div>
                <Sun size={28} className="text-amber-400" />
              </div>
            </div>

            {/* 7. Food Delivery Order */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Active Order #42</span>
              <div className="flex items-center gap-2 text-[9px] font-bold"><span style={{ color: c2 }}>● Out for Delivery</span><span className="ml-auto opacity-60">12 mins away</span></div>
            </div>

            {/* 8. Task Checklist */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Daily Agenda</span>
              <div className="space-y-1.5 text-[9px]">
                <div className="flex items-center gap-2"><CheckSquare size={10} style={{ color: c2 }} /> Submit Palette Audit</div>
                <div className="flex items-center gap-2 opacity-50"><CheckSquare size={10} /> Design System Review</div>
              </div>
            </div>

            {/* 9. Rideshare Booking */}
            <div className={cardStyle}>
              <div className="flex justify-between items-center text-[9px] font-bold">
                <div><div>UberX Comfort</div><div className="opacity-60">4 mins away</div></div>
                <div style={{ color: c1 }} className="font-mono text-xs font-black">$18.50</div>
              </div>
            </div>

            {/* 10. Crypto Asset Tracker */}
            <div className={cardStyle}>
              <div className="flex justify-between items-center text-[9px]">
                <div className="font-bold">Bitcoin (BTC)</div>
                <div style={{ color: c2 }} className="font-mono font-bold">$64,280.00 (+4.2%)</div>
              </div>
            </div>
          </>
        )}

        {/* CATEGORY 3: LANDING PAGE (10 PREVIEWS) */}
        {activeCategory === 'landing' && (
          <>
            {/* 1. Hero Banner */}
            <div className={cardStyle}>
              <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded border mb-2 inline-block" style={{ borderColor: c0, color: c0 }}>V2.0 RELEASE</span>
              <h4 className="text-sm font-black mb-1">Design <span style={{ color: c0 }}>Faster</span></h4>
              <p className="text-[9px] opacity-70 mb-3">Unified color system for modern UI web apps.</p>
              <button style={{ backgroundColor: c0 }} className="px-3 py-1.5 text-[9px] font-bold text-white rounded-lg shadow">Get Started</button>
            </div>

            {/* 2. Feature Matrix Tile */}
            <div className={cardStyle}>
              <div style={{ color: c0 }} className="mb-1"><Sparkles size={16} /></div>
              <h5 className="text-[10px] font-bold mb-1">Smart HSL Harmony</h5>
              <p className="text-[8px] opacity-60">Automated vector interpolation algorithms.</p>
            </div>

            {/* 3. Pricing Tier */}
            <div className={cardStyle}>
              <div className="text-[9px] font-bold uppercase opacity-60">ENTERPRISE</div>
              <div className="text-xl font-black font-mono my-1">$99<span className="text-xs font-normal">/mo</span></div>
              <button style={{ backgroundColor: c0 }} className="w-full py-1.5 text-[9px] font-bold text-white rounded-lg">Contact Sales</button>
            </div>

            {/* 4. Testimonial Quote */}
            <div className={cardStyle}>
              <div className="flex text-amber-400 gap-0.5 mb-1"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></div>
              <p className="text-[8px] italic opacity-80">"Transformed our design workflow completely!"</p>
              <div className="text-[8px] font-bold mt-2">— Tech Lead at Stripe</div>
            </div>

            {/* 5. FAQ Accordion Item */}
            <div className={cardStyle}>
              <div className="flex justify-between items-center text-[9px] font-bold"><span>Can I export CSS Variables?</span><ChevronRight size={12} style={{ color: c0 }} /></div>
            </div>

            {/* 6. Newsletter Signup Box */}
            <div className={cardStyle}>
              <span className="text-[9px] font-bold uppercase opacity-60 mb-2 block">Subscribe Newsletter</span>
              <div className="flex gap-1">
                <input type="email" placeholder="email@domain.com" className="w-full text-[8px] px-2 py-1 rounded bg-slate-500/10 border border-slate-500/20" />
                <button style={{ backgroundColor: c0 }} className="px-2 py-1 text-[8px] font-bold text-white rounded">Join</button>
              </div>
            </div>

            {/* 7. Team Bio Card */}
            <div className={cardStyle}>
              <div className="flex items-center gap-2">
                <div style={{ backgroundColor: c1 }} className="w-8 h-8 rounded-full text-white font-bold text-[9px] flex items-center justify-center">MK</div>
                <div><div className="text-[9px] font-bold">Marcus King</div><div className="text-[7px] opacity-60">Head of Product</div></div>
              </div>
            </div>

            {/* 8. Stat Counter Banner */}
            <div className={cardStyle}>
              <div className="text-center">
                <div style={{ color: c0 }} className="text-xl font-black font-mono">10M+</div>
                <div className="text-[8px] font-bold opacity-60 uppercase">Swatches Generated</div>
              </div>
            </div>

            {/* 9. App Download Badge */}
            <div className={cardStyle}>
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span>Download iOS App</span>
                <button style={{ backgroundColor: c0 }} className="px-2 py-1 text-white text-[8px] font-bold rounded">Get App</button>
              </div>
            </div>

            {/* 10. Footer Quick Block */}
            <div className={cardStyle}>
              <div className="flex justify-between text-[8px] opacity-60 font-bold"><span>© 2026 Krasola</span><span>Privacy • Terms</span></div>
            </div>
          </>
        )}

        {/* CATEGORY 4: DATA CHARTS (10 PREVIEWS) */}
        {activeCategory === 'charts' && (
          <>
            {/* 1. Bar Chart */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Monthly Revenue Bar</span>
              <div className="h-20 flex items-end justify-between gap-1.5">
                {[65, 85, 45, 90, 75].map((val, i) => (
                  <div key={i} style={{ height: `${val}%`, backgroundColor: swatches[i % swatches.length] }} className="flex-1 rounded-t shadow" />
                ))}
              </div>
            </div>

            {/* 2. Donut Ring */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Device Breakdown</span>
              <div className="flex items-center justify-around">
                <div style={{ borderColor: c0 }} className="w-14 h-14 rounded-full border-8 border-t-indigo-400 flex items-center justify-center font-bold text-[9px]">64%</div>
                <div className="text-[8px] space-y-1"><div className="flex items-center gap-1"><span style={{ backgroundColor: c0 }} className="w-2 h-2 rounded-full" />Desktop</div><div className="flex items-center gap-1"><span style={{ backgroundColor: c1 }} className="w-2 h-2 rounded-full" />Mobile</div></div>
              </div>
            </div>

            {/* 3. Smooth Area Graph */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Traffic Growth Trend</span>
              <div className="h-16 flex items-end gap-1">
                {[30, 45, 60, 50, 80, 95].map((v, i) => (
                  <div key={i} style={{ height: `${v}%`, backgroundColor: c0 }} className="flex-1 rounded-t opacity-80" />
                ))}
              </div>
            </div>

            {/* 4. Radial Progress Gauges */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Storage & Memory Gauges</span>
              <div className="flex gap-2 text-center text-[8px] font-bold">
                <div className="flex-1 p-2 rounded bg-slate-500/10" style={{ color: c0 }}>CPU: 42%</div>
                <div className="flex-1 p-2 rounded bg-slate-500/10" style={{ color: c2 }}>RAM: 88%</div>
              </div>
            </div>

            {/* 5. Comparison Column */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Q1 vs Q2 Growth</span>
              <div className="flex gap-4 items-end h-16 justify-center">
                <div style={{ backgroundColor: c0 }} className="w-6 h-12 rounded-t" />
                <div style={{ backgroundColor: c1 }} className="w-6 h-16 rounded-t" />
              </div>
            </div>

            {/* 6. Conversion Funnel */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Conversion Funnel</span>
              <div className="space-y-1 text-[8px] font-bold">
                <div style={{ backgroundColor: c0 }} className="p-1 rounded text-white text-center">Visits: 100K</div>
                <div style={{ backgroundColor: c1, width: '70%' }} className="p-1 rounded text-white text-center mx-auto">Leads: 70K</div>
                <div style={{ backgroundColor: c2, width: '40%' }} className="p-1 rounded text-white text-center mx-auto">Paid: 40K</div>
              </div>
            </div>

            {/* 7. Heatmap Matrix */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Activity Heatmap</span>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(14)].map((_, i) => (
                  <div key={i} style={{ backgroundColor: swatches[i % swatches.length] }} className="h-4 rounded" />
                ))}
              </div>
            </div>

            {/* 8. Bubble Scatter Plot */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Scatter Value Plot</span>
              <div className="h-16 flex items-center justify-around">
                <span style={{ backgroundColor: c0 }} className="w-6 h-6 rounded-full inline-block shadow" />
                <span style={{ backgroundColor: c1 }} className="w-10 h-10 rounded-full inline-block shadow" />
                <span style={{ backgroundColor: c2 }} className="w-4 h-4 rounded-full inline-block shadow" />
              </div>
            </div>

            {/* 9. Waterfall Chart */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Revenue Waterfall</span>
              <div className="flex gap-2 items-end h-16 justify-center">
                <div style={{ backgroundColor: c2 }} className="w-4 h-12 rounded-t" />
                <div style={{ backgroundColor: c4 }} className="w-4 h-6 rounded-t" />
                <div style={{ backgroundColor: c0 }} className="w-4 h-14 rounded-t" />
              </div>
            </div>

            {/* 10. Stacked Progress Bar */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Stacked Segment</span>
              <div className="h-3 w-full rounded-full overflow-hidden flex">
                <div style={{ width: '50%', backgroundColor: c0 }} />
                <div style={{ width: '30%', backgroundColor: c1 }} />
                <div style={{ width: '20%', backgroundColor: c2 }} />
              </div>
            </div>
          </>
        )}

        {/* CATEGORY 5: E-COMMERCE (10 PREVIEWS) */}
        {activeCategory === 'ecommerce' && (
          <>
            {/* 1. Product Showcase */}
            <div className={cardStyle}>
              <div className="h-28 rounded-xl bg-slate-500/10 flex items-center justify-center mb-2" style={{ backgroundColor: `${swatches[selectedProductVariant % swatches.length]}20` }}>
                <ShieldCheck size={28} style={{ color: swatches[selectedProductVariant % swatches.length] }} />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span>Pro Wireless Headset</span>
                <span style={{ color: c1 }} className="font-mono">$299.00</span>
              </div>
              <button style={{ backgroundColor: c0 }} className="w-full mt-2 py-1.5 text-[8px] font-bold text-white rounded-lg">Add to Cart</button>
            </div>

            {/* 2. Cart Drawer */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Shopping Cart (1)</span>
              <div className="flex justify-between text-[9px] font-bold"><span>Total:</span><span style={{ color: c0 }} className="font-mono">$299.00</span></div>
            </div>

            {/* 3. Checkout Payment Card */}
            <div className={cardStyle}>
              <span className="text-[10px] font-black uppercase opacity-60 mb-2 block">Payment Method</span>
              <button style={{ backgroundColor: c0 }} className="w-full py-1.5 text-[8px] font-bold text-white rounded">Pay $299.00 Now</button>
            </div>

            {/* 4. Flash Sale Banner */}
            <div className={cardStyle}>
              <div style={{ backgroundColor: c4 }} className="p-2 rounded-xl text-white text-center font-bold text-[9px]">FLASH SALE 50% OFF</div>
            </div>

            {/* 5. Customer Review Breakdown */}
            <div className={cardStyle}>
              <div className="text-[10px] font-bold">Rating 4.9 / 5.0</div>
              <div className="h-1.5 w-full bg-slate-500/20 rounded-full mt-1"><div style={{ width: '92%', backgroundColor: c2 }} className="h-full rounded-full" /></div>
            </div>

            {/* 6. Spec Comparison Table */}
            <div className={cardStyle}>
              <span className="text-[9px] font-bold opacity-60 mb-1 block">Spec Comparison</span>
              <div className="text-[8px] space-y-1"><div className="flex justify-between"><span>Battery:</span><span className="font-bold">40 Hours</span></div></div>
            </div>

            {/* 7. Wishlist Card */}
            <div className={cardStyle}>
              <div className="flex justify-between items-center text-[9px]"><span>Saved Wishlist</span><Heart size={12} className="text-red-500 fill-current" /></div>
            </div>

            {/* 8. Delivery Order Tracker */}
            <div className={cardStyle}>
              <span className="text-[9px] font-bold opacity-60 mb-1 block">Order Status</span>
              <span style={{ color: c2 }} className="text-[9px] font-bold">✓ Delivered Yesterday</span>
            </div>

            {/* 9. Category Nav Tile */}
            <div className={cardStyle}>
              <div style={{ backgroundColor: `${c0}20`, color: c0 }} className="p-3 rounded-xl font-bold text-xs text-center">Audio Gadgets</div>
            </div>

            {/* 10. Promo Code Box */}
            <div className={cardStyle}>
              <div className="flex gap-1">
                <input placeholder="PROMO2026" className="w-full text-[8px] px-2 py-1 rounded bg-slate-500/10 border border-slate-500/20" />
                <button style={{ backgroundColor: c0 }} className="px-2 text-[8px] font-bold text-white rounded">Apply</button>
              </div>
            </div>
          </>
        )}

        {/* CATEGORY 6: DESIGN SYSTEM (10 PREVIEWS) */}
        {activeCategory === 'designSystem' && (
          <>
            {/* 1. Type Scale */}
            <div className={cardStyle}>
              <span className="text-[8px] font-mono uppercase opacity-50 block mb-1">TYPE HIERARCHY</span>
              <h4 style={{ color: c0 }} className="text-base font-black">H1 Title Typography</h4>
              <p className="text-[9px] opacity-70">Body copy paragraph text.</p>
            </div>

            {/* 2. Swatch Tokens */}
            <div className={cardStyle}>
              <span className="text-[8px] font-mono uppercase opacity-50 block mb-1">PALETTE TOKENS</span>
              <div className="grid grid-cols-5 gap-1">
                {swatches.map((hex, i) => (
                  <div key={i} style={{ backgroundColor: hex }} className="h-6 rounded text-[7px] text-white font-mono font-bold flex items-center justify-center">{i + 1}</div>
                ))}
              </div>
            </div>

            {/* 3. Button Matrix */}
            <div className={cardStyle}>
              <span className="text-[8px] font-mono uppercase opacity-50 block mb-1">BUTTON STATES</span>
              <button style={{ backgroundColor: c0 }} className="w-full py-1 text-[8px] font-bold text-white rounded mb-1">Primary State</button>
              <button style={{ borderColor: c1, color: c1 }} className="w-full py-1 text-[8px] font-bold border rounded bg-transparent">Outlined State</button>
            </div>

            {/* 4. Form Input Field */}
            <div className={cardStyle}>
              <span className="text-[8px] font-mono uppercase opacity-50 block mb-1">INPUT FIELD</span>
              <input type="text" value="Active input value" readOnly style={{ borderColor: c0 }} className="w-full text-[8px] p-1.5 rounded border bg-transparent font-bold" />
            </div>

            {/* 5. Badge System */}
            <div className={cardStyle}>
              <span className="text-[8px] font-mono uppercase opacity-50 block mb-1">TAG SYSTEM</span>
              <div className="flex gap-1"><span style={{ backgroundColor: `${c0}25`, color: c0 }} className="px-2 py-0.5 text-[7px] font-bold rounded">Tag A</span><span style={{ backgroundColor: `${c2}25`, color: c2 }} className="px-2 py-0.5 text-[7px] font-bold rounded">Tag B</span></div>
            </div>

            {/* 6. Switch Toggles */}
            <div className={cardStyle}>
              <span className="text-[8px] font-mono uppercase opacity-50 block mb-1">TOGGLE SWITCH</span>
              <div className="flex justify-between items-center text-[9px]"><span>Dark Theme</span><ToggleLeft size={16} style={{ color: c0 }} /></div>
            </div>

            {/* 7. Modal Dialog */}
            <div className={cardStyle}>
              <span className="text-[8px] font-mono uppercase opacity-50 block mb-1">MODAL WINDOW</span>
              <div className="text-[9px] font-bold">Confirm Action?</div>
              <button style={{ backgroundColor: c0 }} className="w-full mt-2 py-1 text-[8px] font-bold text-white rounded">Confirm</button>
            </div>

            {/* 8. Alert Banner */}
            <div className={cardStyle}>
              <div style={{ backgroundColor: `${c2}25`, color: c2 }} className="p-2 rounded text-[8px] font-bold flex items-center gap-1"><Info size={10} /> System operational</div>
            </div>

            {/* 9. Tooltip Preview */}
            <div className={cardStyle}>
              <div style={{ backgroundColor: c0 }} className="p-2 rounded text-[8px] font-bold text-white text-center shadow">Micro Tooltip Card</div>
            </div>

            {/* 10. Avatar Stack */}
            <div className={cardStyle}>
              <span className="text-[8px] font-mono uppercase opacity-50 block mb-1">AVATAR GROUP</span>
              <div className="flex -space-x-2"><div style={{ backgroundColor: c0 }} className="w-6 h-6 rounded-full border border-white text-[7px] font-bold text-white flex items-center justify-center">A</div><div style={{ backgroundColor: c1 }} className="w-6 h-6 rounded-full border border-white text-[7px] font-bold text-white flex items-center justify-center">B</div></div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
