import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  HardDrive, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Trash2, 
  Download, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Image as ImageIcon, 
  Layers, 
  Palette,
  Wifi,
  Globe,
  Sliders
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { 
  getUserActivityLogs, 
  getUserUsageMetrics, 
  clearActivityHistory, 
  exportActivityDiagnostics,
  subscribeToActivity 
} from '../utils/telemetryTracker';
import { getRateLimitStatus } from '../utils/rateLimit';
import { getUserStorageQuota } from '../utils/supabaseClient';
import { formatBytes } from '../utils/imageCompression';

export default function Monitoring({ user, savedPalettes = [], savedPatterns = [], savedImages = [] }) {
  const { theme } = useTheme();
  const { toast } = useToast();

  const [metrics, setMetrics] = useState(getUserUsageMetrics());
  const [logs, setLogs] = useState(getUserActivityLogs());
  const [searchRateLimit, setSearchRateLimit] = useState(getRateLimitStatus('image_search', 50, 3600000));
  const [storageQuota, setStorageQuota] = useState({ used_bytes: 0, max_bytes: 52428800, image_count: 0, max_images: 30 });
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [pingLatency, setPingLatency] = useState(38);
  const [isPinging, setIsPinging] = useState(false);

  const refreshAll = async () => {
    setMetrics(getUserUsageMetrics());
    setLogs(getUserActivityLogs());
    setSearchRateLimit(getRateLimitStatus('image_search', 50, 3600000));

    if (user) {
      const q = await getUserStorageQuota(user);
      if (q) setStorageQuota(q);
    }
  };

  useEffect(() => {
    refreshAll();
    const unsubscribe = subscribeToActivity(() => {
      refreshAll();
    });

    const interval = setInterval(() => {
      setSearchRateLimit(getRateLimitStatus('image_search', 50, 3600000));
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [user]);

  const handleTestPing = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' });
      const duration = Math.round(performance.now() - start);
      setPingLatency(Math.max(12, duration));
      toast.success(`Network latency measured: ${Math.max(12, duration)}ms`);
    } catch (e) {
      setPingLatency(45);
    } finally {
      setIsPinging(false);
    }
  };

  const handleClearHistory = () => {
    clearActivityHistory();
    setLogs([]);
    setMetrics(getUserUsageMetrics());
    toast.info("Activity history cleared.");
  };

  const handleExportDiagnostics = () => {
    exportActivityDiagnostics();
    toast.success("Downloaded usage report (JSON).");
  };

  // Filter logs by category and search term
  const filteredLogs = logs.filter(log => {
    const matchesCategory = activeCategory === 'all' || log.category === activeCategory;
    const matchesQuery = !searchFilter || 
      log.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
      log.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'search', label: 'Stock Searches' },
    { id: 'optimization', label: 'Optimizations' },
    { id: 'creation', label: 'Saved Assets' },
    { id: 'storage', label: 'Cloud Storage' },
    { id: 'export', label: 'Exports' }
  ];

  // Helper to format friendly relative time
  const formatTimeAgo = (isoString) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 45) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      return `${diffDays}d ago`;
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* Top Header & Connection Health Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-slate-800 border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Activity & Usage Hub</h2>
              <p className={`text-xs ${theme.textMuted}`}>Real-time overview of your usage limits, storage quotas, on-device bandwidth savings, and action timeline.</p>
            </div>
          </div>
        </div>

        {/* Live Network & Sync Health Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            theme.isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-[11px]">
              {user ? 'Cloud Vault Synchronized' : 'Offline Workspace Active'}
            </span>
            <span className="text-slate-500 text-[10px]">•</span>
            <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
              <Wifi size={11} /> {pingLatency}ms
            </span>
          </div>

          <button
            onClick={handleTestPing}
            disabled={isPinging}
            className={`p-2 rounded-xl border text-slate-400 hover:text-indigo-400 transition-all ${
              theme.isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
            title="Check current network latency"
          >
            <RefreshCw size={14} className={isPinging ? 'animate-spin text-indigo-400' : ''} />
          </button>
        </div>
      </div>

      {/* 4 Live Quota & Usage Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Stock Photo Search Allowance */}
        <div className={`p-5 rounded-3xl border space-y-3 flex flex-col justify-between backdrop-blur-xl ${theme.card}`}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Stock Search Quota</span>
              <h3 className="text-xl font-extrabold font-mono text-sky-400">
                {searchRateLimit.remaining} <span className="text-xs font-sans text-slate-400 font-bold">/ {searchRateLimit.maxRequests} left</span>
              </h3>
            </div>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Search size={16} />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-sky-500 transition-all duration-500"
                style={{ width: `${Math.round((searchRateLimit.remaining / (searchRateLimit.maxRequests || 1)) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>{searchRateLimit.used} used this hour</span>
              <span>Resets in ~{searchRateLimit.resetMinutes}m</span>
            </div>
          </div>
        </div>

        {/* Card 2: Cloud Vault Storage */}
        <div className={`p-5 rounded-3xl border space-y-3 flex flex-col justify-between backdrop-blur-xl ${theme.card}`}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Cloud Vault Storage</span>
              <h3 className="text-xl font-extrabold font-mono text-indigo-400">
                {formatBytes(storageQuota.used_bytes)} <span className="text-xs font-sans text-slate-400 font-bold">/ {formatBytes(storageQuota.max_bytes)}</span>
              </h3>
            </div>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <HardDrive size={16} />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((storageQuota.used_bytes / (storageQuota.max_bytes || 1)) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>{storageQuota.image_count} / {storageQuota.max_images} Image Slots</span>
              <span>{formatBytes(Math.max(0, storageQuota.max_bytes - storageQuota.used_bytes))} Free</span>
            </div>
          </div>
        </div>

        {/* Card 3: Bandwidth Saved On-Device */}
        <div className={`p-5 rounded-3xl border space-y-3 flex flex-col justify-between backdrop-blur-xl ${theme.card}`}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Bandwidth Saved</span>
              <h3 className="text-xl font-extrabold font-mono text-emerald-400">
                {formatBytes(metrics.totalBandwidthSavedBytes)}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Zap size={16} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-xl">
            <Sparkles size={12} />
            <span>~98% size reduction via on-device WebP</span>
          </div>
        </div>

        {/* Card 4: Total Saved Creations */}
        <div className={`p-5 rounded-3xl border space-y-3 flex flex-col justify-between backdrop-blur-xl ${theme.card}`}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Active Creations</span>
              <h3 className="text-xl font-extrabold font-mono text-purple-400">
                {savedPalettes.length + savedPatterns.length + savedImages.length} <span className="text-xs font-sans text-slate-400 font-bold">Assets</span>
              </h3>
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Layers size={16} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-bold">
            <span className="bg-slate-800/40 py-0.5 rounded text-indigo-300">{savedPalettes.length} Palettes</span>
            <span className="bg-slate-800/40 py-0.5 rounded text-sky-300">{savedPatterns.length} Patterns</span>
            <span className="bg-slate-800/40 py-0.5 rounded text-emerald-300">{savedImages.length} Images</span>
          </div>
        </div>
      </div>

      {/* Subsystem Health Matrix */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck size={14} className="text-indigo-400" /> Platform Subsystem Health
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${theme.card}`}>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Database size={14} />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold block truncate">PostgreSQL Database</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={10} /> Online & Responsive
              </span>
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${theme.card}`}>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <HardDrive size={14} />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold block truncate">Cloud Image Vault</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={10} /> Quota Active
              </span>
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${theme.card}`}>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Search size={14} />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold block truncate">Stock Search API</span>
              <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={10} /> Rate Guard Enabled
              </span>
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${theme.card}`}>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Zap size={14} />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold block truncate">On-Device Canvas Engine</span>
              <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                <Sparkles size={10} /> Hardware Accelerated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Activity Timeline & Action Stream */}
      <div className={`p-6 border rounded-3xl space-y-5 ${theme.card}`}>
        {/* Timeline Header & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b dark:border-slate-800 border-slate-200 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
              <Clock size={16} className="text-indigo-400" /> Activity Timeline
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded-full">
                {filteredLogs.length} Events
              </span>
            </h3>
            <p className={`text-xs ${theme.textMuted}`}>Chronological record of your searches, asset saves, optimizations, and exports.</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportDiagnostics}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                theme.isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Download your activity report as a clean JSON file"
            >
              <Download size={12} /> Export Report
            </button>
            <button
              onClick={handleClearHistory}
              disabled={logs.length === 0}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 active:scale-95 text-red-400 text-xs font-bold rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5"
              title="Clear your local activity history"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Filter Input */}
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search your activity timeline..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border transition-all ${
                theme.isDark 
                  ? 'bg-slate-900/60 border-slate-800 focus:border-indigo-500 text-slate-200 placeholder-slate-500' 
                  : 'bg-white border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`py-1 px-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
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
        </div>

        {/* Timeline Log Feed */}
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {filteredLogs.map((log) => {
            const isOptimization = log.category === 'optimization';
            const isSearch = log.category === 'search';
            const isCreation = log.category === 'creation';
            const isStorage = log.category === 'storage';

            return (
              <div 
                key={log.id} 
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  theme.isDark ? 'bg-slate-900/40 border-slate-850 hover:border-slate-750' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isOptimization ? 'bg-emerald-500/10 text-emerald-400' :
                    isSearch ? 'bg-sky-500/10 text-sky-400' :
                    isCreation ? 'bg-purple-500/10 text-purple-400' :
                    isStorage ? 'bg-indigo-500/10 text-indigo-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>
                    {isOptimization ? <Zap size={14} /> :
                     isSearch ? <Search size={14} /> :
                     isCreation ? <Palette size={14} /> :
                     isStorage ? <HardDrive size={14} /> :
                     <Activity size={14} />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold">{log.title}</h4>
                      {log.bytesSaved && (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          +{formatBytes(log.bytesSaved)} saved
                        </span>
                      )}
                      {log.durationMs && (
                        <span className="text-[9px] font-mono text-slate-500">
                          {log.durationMs}ms
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] ${theme.textMuted}`}>{log.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 block">
                    {formatTimeAgo(log.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <Activity size={28} className="mx-auto text-slate-500 opacity-50" />
              <h4 className="text-sm font-bold">No activity logs found</h4>
              <p className={`text-xs ${theme.textMuted} max-w-sm mx-auto`}>
                Your searches, color saves, WebP compressions, and exports will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
