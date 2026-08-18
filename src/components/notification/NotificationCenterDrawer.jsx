import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  X, 
  Palette, 
  Layers, 
  Image as ImageIcon, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  Check, 
  Inbox,
  Filter
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

// Helper for relative timestamps
const formatRelativeTime = (isoString) => {
  if (!isoString) return 'Recently';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
};

export const NotificationCenterDrawer = ({ theme, onNavigateTab }) => {
  const { 
    notifications, 
    unreadCount, 
    isDrawerOpen, 
    closeDrawer, 
    markAsRead, 
    markAllAsRead, 
    clearReadNotifications, 
    deleteNotification 
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'unread', 'assets', 'system'

  // Filtered notifications list
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      if (activeFilter === 'unread') return !notif.is_read;
      if (activeFilter === 'assets') return ['palette', 'pattern', 'image', 'asset_saved', 'export'].includes(notif.category) || ['palette', 'pattern', 'image'].includes(notif.type);
      if (activeFilter === 'system') return ['system', 'security', 'account', 'quota_alert'].includes(notif.category) || ['system', 'security'].includes(notif.type);
      return true;
    });
  }, [notifications, activeFilter]);

  if (!isDrawerOpen) return null;

  // Render category icon
  const renderCategoryIcon = (notif) => {
    const cat = notif.category || notif.type || 'general';
    switch (cat) {
      case 'palette':
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Palette size={15} />
          </div>
        );
      case 'pattern':
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Layers size={15} />
          </div>
        );
      case 'image':
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ImageIcon size={15} />
          </div>
        );
      case 'security':
      case 'account':
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck size={15} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
            <Sparkles size={15} />
          </div>
        );
    }
  };

  const handleActionClick = (notif) => {
    markAsRead(notif.id);
    if (notif.action_tab && onNavigateTab) {
      onNavigateTab(notif.action_tab);
      closeDrawer();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={closeDrawer} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-Over Drawer Container */}
      <div 
        className={`relative w-full max-w-md h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 border-l ${
          theme.isDark 
            ? 'bg-slate-900/95 border-slate-800 text-slate-100' 
            : 'bg-white/95 border-slate-200 text-slate-800'
        } backdrop-blur-xl`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${theme.isDark ? 'border-slate-800/80 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
              <Bell size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold tracking-tight">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-500 text-white rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className={`text-[11px] ${theme.textMuted}`}>Capped at last 50 activity notices</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={closeDrawer}
              className={`p-2 rounded-xl transition-colors ${theme.isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              title="Close Panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Toolbar & Filters */}
        <div className={`p-3 border-b flex flex-col gap-2.5 ${theme.isDark ? 'border-slate-800/60 bg-slate-900/30' : 'border-slate-100 bg-slate-50/30'}`}>
          {/* Quick Actions Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  activeFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : theme.isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({notifications.length})
              </button>

              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  activeFilter === 'unread'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : theme.isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Unread ({unreadCount})
              </button>

              <button
                onClick={() => setActiveFilter('assets')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  activeFilter === 'assets'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : theme.isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Design Assets
              </button>

              <button
                onClick={() => setActiveFilter('system')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  activeFilter === 'system'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : theme.isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Security & Sync
              </button>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`p-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors ${
                    theme.isDark 
                      ? 'text-indigo-400 hover:bg-indigo-500/10' 
                      : 'text-indigo-600 hover:bg-indigo-50'
                  }`}
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}

              {notifications.some(n => n.is_read) && (
                <button
                  onClick={clearReadNotifications}
                  className={`p-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors ${
                    theme.isDark 
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-rose-400' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-rose-600'
                  }`}
                  title="Clear all read"
                >
                  <Trash2 size={13} />
                  <span className="hidden sm:inline">Clear read</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notification List Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 scrollbar-thin">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3.5 ${theme.isDark ? 'bg-slate-800/80 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                <Inbox size={28} />
              </div>
              <h3 className="text-sm font-bold tracking-tight mb-1">All caught up!</h3>
              <p className={`text-xs max-w-xs ${theme.textMuted}`}>
                {activeFilter === 'unread' 
                  ? 'You have zero unread notifications.' 
                  : 'No activity notices in this category. Studio events and cloud updates will appear here.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`group relative p-3.5 rounded-2xl border transition-all duration-200 ${
                  !notif.is_read
                    ? theme.isDark 
                      ? 'bg-slate-800/70 border-indigo-500/40 shadow-lg shadow-indigo-950/20' 
                      : 'bg-indigo-50/50 border-indigo-200/80 shadow-sm'
                    : theme.isDark 
                      ? 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700' 
                      : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                }`}
              >
                {/* Unread Accent Dot */}
                {!notif.is_read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}

                <div className="flex items-start gap-3">
                  {renderCategoryIcon(notif)}

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className={`text-xs font-bold truncate ${!notif.is_read ? 'text-indigo-400 font-extrabold' : ''}`}>
                        {notif.title}
                      </h4>
                    </div>

                    <p className={`text-[11px] leading-relaxed mb-2.5 ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {notif.message}
                    </p>

                    {/* Meta & Actions Row */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                        <Clock size={11} />
                        {formatRelativeTime(notif.created_at)}
                      </span>

                      <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        {notif.action_tab && (
                          <button
                            onClick={() => handleActionClick(notif)}
                            className="px-2 py-0.5 rounded-md bg-indigo-600/10 hover:bg-indigo-600 text-indigo-500 hover:text-white font-semibold flex items-center gap-1 transition-all"
                          >
                            <span>Open</span>
                            <ExternalLink size={10} />
                          </button>
                        )}

                        {!notif.is_read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className={`p-1 rounded-md transition-colors ${theme.isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                            title="Mark as read"
                          >
                            <Check size={12} />
                          </button>
                        )}

                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className={`p-1 rounded-md transition-colors ${theme.isDark ? 'hover:bg-rose-500/20 text-slate-500 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'}`}
                          title="Delete notice"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info bar */}
        <div className={`p-3 border-t text-center text-[10px] ${theme.isDark ? 'border-slate-800 bg-slate-900/60 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
          <span>⚡ Active ring-buffer automatically preserves your 50 latest notices.</span>
        </div>
      </div>
    </div>
  );
};
