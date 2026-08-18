import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, ShieldCheck, LogOut, RefreshCw, AlertCircle, 
  CheckCircle2, XCircle, Info, Shield, Database, Code, ChevronRight, 
  Download, Eye, EyeOff, Laptop, Key, Trash2, Sliders, Globe, RefreshCcw,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { THEMES } from '../utils/themeUtils';
import { supabase, isSupabaseConfigured, getUserStorageQuota } from '../utils/supabaseClient';
import { formatBytes } from '../utils/imageCompression';

export default function Account({ 
  savedPalettes, 
  savedPatterns, 
  setSavedPalettes, 
  setSavedPatterns, 
  onRefreshCloud
}) {
  const { theme, activeThemeId, setActiveThemeId } = useTheme();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'magiclink'
  const [activeSection, setActiveSection] = useState('profile');
  const [storageQuota, setStorageQuota] = useState({
    used_bytes: 0,
    max_bytes: 52428800,
    image_count: 0,
    max_images: 30
  });

  // Profile preferences
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarStyle, setAvatarStyle] = useState('geometric'); // 'geometric', 'retro', 'pixel'
  
  // Security
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [activityLogs, setActivityLogs] = useState([
    { event: 'Logged in securely', time: 'Just now', ip: '127.0.0.1' },
    { event: 'Profile sync updated', time: '5 mins ago', ip: '127.0.0.1' }
  ]);

  // Cloud Archiver Options
  const [autoSync, setAutoSync] = useState(() => {
    return JSON.parse(localStorage.getItem('pref_auto_sync') || 'true');
  });

  // Password rules checks
  const [passRules, setPassRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false
  });

  const [clientIp, setClientIp] = useState('Detecting...');
  const [sessionAgent, setSessionAgent] = useState('Detecting...');

  useEffect(() => {
    // Graceful client IP detection with privacy fallback
    try {
      fetch('https://api.ipify.org?format=json')
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => setClientIp(data.ip || 'Protected Client'))
        .catch(() => setClientIp('Protected Client'));
    } catch {
      setClientIp('Protected Client');
    }

    // Detect browser agent details
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';

    if (ua.includes('Windows')) os = 'Windows Desktop';
    else if (ua.includes('Macintosh')) os = 'macOS Desktop';
    else if (ua.includes('Linux')) os = 'Linux Desktop';
    else if (ua.includes('Android')) os = 'Android Mobile';
    else if (ua.includes('iPhone')) os = 'iOS Mobile';
    
    setSessionAgent(`${browser} on ${os}`);
  }, []);

  // Username generator
  const handleAutoGenerateUsername = () => {
    const prefixes = ['krasola', 'pixel', 'color', 'vector', 'studio', 'palette', 'canvas', 'fluid', 'design'];
    const suffixes = ['guru', 'wizard', 'artist', 'maker', 'pro', 'ninja', 'creator', 'master', 'craft'];
    const pre = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
    const randNum = Math.floor(100 + Math.random() * 900);
    setUsername(`${pre}_${suf}_${randNum}`);
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      const fetchProfileDetails = async (sessionUser) => {
        if (!sessionUser) return;
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionUser.id)
            .maybeSingle();
          if (profile) {
            setUsername(profile.username);
            setBio(profile.bio || '');
            setAvatarStyle(profile.avatar_style || 'geometric');
          } else {
            setUsername(sessionUser.user_metadata?.display_name || sessionUser.email.split('@')[0]);
          }

          const quota = await getUserStorageQuota(sessionUser);
          if (quota) setStorageQuota(quota);
        } catch (e) {
          console.warn("Error loading user profile.", e);
        }
      };

      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchProfileDetails(session.user);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchProfileDetails(session.user);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    setPassRules({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    });
  }, [password]);

  const isPasswordValid = passRules.length && passRules.uppercase && passRules.number && passRules.symbol;

  const logActivity = (event) => {
    const newLog = {
      event,
      time: 'Just now',
      ip: '127.0.0.1'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      logActivity('Sign in completed');
      toast.success('Welcome back to Krasola!');
      addNotification({
        title: 'Welcome Back',
        message: 'You have signed in to your Krasola Cloud Workspace.',
        type: 'security',
        category: 'account',
        actionTab: 'account'
      });
    } catch (err) {
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Passwordless Magic Link Login
  const handleMagicLinkLogin = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
      toast.success('Success! Check your email inbox for the magic sign-in link.');
      logActivity('Requested magic link sign in');
      addNotification({
        title: 'Magic Link Requested',
        message: `A sign-in link was dispatched to ${email}.`,
        type: 'security',
        category: 'account',
        actionTab: 'account'
      });
    } catch (err) {
      toast.error(err.message || 'Magic link request failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !isPasswordValid) return;
    setLoading(true);

    try {
      // Validate unique username before signup
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();
      if (existing) {
        toast.warning("The username is already taken. Please choose another display name.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: username || email.split('@')[0],
            bio: '',
            avatar_style: 'geometric'
          }
        }
      });
      if (error) throw error;
      toast.success('Sign up successful! Please check your email for confirmation.');
      addNotification({
        title: 'Account Created',
        message: 'Your Krasola account has been initialized with 50MB cloud vault.',
        type: 'system',
        category: 'account',
        actionTab: 'account'
      });
    } catch (err) {
      toast.error(err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Update Profile Display Name & Bio
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !user) return;
    setLoading(true);

    try {
      // Validate unique username before update
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .not('id', 'eq', user.id)
        .maybeSingle();
      if (existing) {
        toast.warning("The handle is already taken by another creator.");
        setLoading(false);
        return;
      }

      // Update profiles public table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          avatar_style: avatarStyle
        })
        .eq('id', user.id);
      if (profileError) throw profileError;

      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          display_name: username,
          bio: bio,
          avatar_style: avatarStyle
        }
      });
      if (authError) throw authError;

      logActivity('Profile details updated');
      toast.success('Profile details updated successfully!');
      addNotification({
        title: 'Profile Updated',
        message: `Your creator profile details have been saved successfully.`,
        type: 'system',
        category: 'account',
        actionTab: 'account'
      });
    } catch (err) {
      toast.error(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  // Revoke other device sessions
  const handleRevokeOthers = async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' });
      if (error) throw error;
      logActivity('Revoked other device sessions');
      toast.info('Logged out of all other active sessions.');
      addNotification({
        title: 'Device Sessions Revoked',
        message: 'All other active browser and device sessions have been terminated.',
        type: 'security',
        category: 'account',
        actionTab: 'account'
      });
    } catch (err) {
      toast.error(err.message || 'Revocation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured || newPassword.length < 8) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      setNewPassword('');
      logActivity('Password credentials rotated');
      toast.success('Password updated successfully!');
      addNotification({
        title: 'Security Alert: Password Changed',
        message: 'Your account password credentials were rotated successfully.',
        type: 'security',
        category: 'account',
        actionTab: 'account'
      });
    } catch (err) {
      toast.error(err.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  // Download local backup JSON file
  const handleDownloadBackup = () => {
    const backup = {
      palettes: JSON.parse(localStorage.getItem('saved_palettes') || '[]'),
      patterns: JSON.parse(localStorage.getItem('saved_patterns') || '[]'),
      exported_at: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `krasola_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    logActivity('Bulk backup exported');
    toast.success('Backup downloaded successfully!');
    addNotification({
      title: 'Vault Backup Exported',
      message: 'A complete JSON snapshot of your palettes and patterns was exported.',
      type: 'export',
      category: 'general',
      actionTab: 'saved'
    });
  };

  // Bulk Delete Cloud Data
  const handleDeleteCloudData = async () => {
    if (!user || !isSupabaseConfigured) return;
    const confirmDelete = window.confirm("Are you absolutely sure you want to delete all your community shared creations? This cannot be undone.");
    if (!confirmDelete) return;
    
    setLoading(true);
    try {
      // 1. Delete palettes
      await supabase.from('community_palettes').delete().eq('user_id', user.id);
      // 2. Delete patterns
      await supabase.from('community_patterns').delete().eq('user_id', user.id);
      
      logActivity('Cloud creations wiped');
      toast.info('All cloud-saved creations deleted.');
      if (onRefreshCloud) onRefreshCloud();
    } catch (err) {
      toast.error(`Wipe failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto sync preference toggler
  const handleToggleAutoSync = (val) => {
    setAutoSync(val);
    localStorage.setItem('pref_auto_sync', JSON.stringify(val));
    logActivity(`Auto-sync set to ${val}`);
    toast.info(`Auto-sync ${val ? 'enabled' : 'disabled'}.`);
  };

  // Sign out
  const handleSignOut = async () => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
      toast.info('Logged out.');
    } catch (err) {
      console.error(err);
    }
  };

  // Sync Guest Data to Supabase
  const handleSyncVault = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let syncCount = 0;

      // Sync local palettes
      const localPalettes = JSON.parse(localStorage.getItem('saved_palettes') || '[]');
      for (const palette of localPalettes) {
        await supabase.from('community_palettes').insert([{
          user_id: user.id,
          username: user.user_metadata?.display_name || user.email.split('@')[0],
          name: palette.name,
          colors: palette.colors,
          mode: palette.mode || 'Custom',
          likes: 0
        }]);
        syncCount++;
      }

      // Sync local patterns
      const localPatterns = JSON.parse(localStorage.getItem('saved_patterns') || '[]');
      for (const pattern of localPatterns) {
        await supabase.from('community_patterns').insert([{
          user_id: user.id,
          username: user.user_metadata?.display_name || user.email.split('@')[0],
          name: pattern.name,
          pattern_type: pattern.patternType || 'dots',
          width: pattern.settings?.width || 40,
          height: pattern.settings?.height || 40,
          scale: pattern.settings?.scale || 1,
          stroke: pattern.settings?.stroke || 2,
          angle: pattern.settings?.angle || 0,
          bg: pattern.settings?.bg || '#0f172a',
          color1: pattern.settings?.color1 || '#6366f1',
          color2: pattern.settings?.color2 || '#38bdf8'
        }]);
        syncCount++;
      }

      logActivity(`Synced ${syncCount} local assets`);
      toast.success(`Successfully synced ${syncCount} assets to your cloud account!`);
      localStorage.setItem('saved_palettes', '[]');
      localStorage.setItem('saved_patterns', '[]');
      setSavedPalettes([]);
      setSavedPatterns([]);
      if (onRefreshCloud) onRefreshCloud();
    } catch (err) {
      toast.error(`Sync failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const offlinePalettesCount = JSON.parse(localStorage.getItem('saved_palettes') || '[]').length;
  const offlinePatternsCount = JSON.parse(localStorage.getItem('saved_patterns') || '[]').length;
  const totalOfflineCount = offlinePalettesCount + offlinePatternsCount;

  const sidebarItems = [
    { id: 'profile', name: 'Profile Settings', icon: User },
    { id: 'security', name: 'Security & Devices', icon: Shield },
    { id: 'backup', name: 'Cloud Archiver', icon: Database },
    { id: 'developer', name: 'Developer API', icon: Code }
  ];

  return (
    <div className={`flex flex-col lg:flex-row h-full rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden ${theme.card}`}>
      {/* Secondary Sidebar (Account Navigation) */}
      <aside className={`w-full lg:w-64 border-b lg:border-b-0 lg:border-r p-4 space-y-1.5 shrink-0 ${theme.isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
        <div className="px-3 py-2 mb-2">
          <h3 className="text-xs font-bold tracking-wider uppercase opacity-60">Account</h3>
        </div>
        <nav className="space-y-1">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? theme.accent 
                    : theme.isDark 
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {user && (
          <div className="pt-4 border-t border-slate-800 mt-4 px-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main Dashboard Panel */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-4xl">
        
        {/* Offline Warning Banner */}
        {!isSupabaseConfigured && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs">
            <AlertCircle size={18} className="shrink-0" />
            <div>
              <span className="font-bold">Offline Local Mode: </span>
              Supabase credentials not found. Design configurations will save inside your browser storage vault instead.
            </div>
          </div>
        )}

        {!user ? (
          /* Sign In / Sign Up Form Interface */
          isSupabaseConfigured && (
            <div className="max-w-md space-y-6">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Access Your Cloud Workspace</h3>
                <p className={`text-xs ${theme.textMuted}`}>Sign in or create an account to back up personal design assets.</p>
              </div>

              <div className={`border rounded-2xl p-6 space-y-6 ${theme.card}`}>
                {/* Switcher Mode Tabs */}
                <div className="flex border-b dark:border-slate-850 border-slate-200 pb-2 gap-4">
                  <button
                    onClick={() => setAuthMode('login')}
                    className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
                      authMode === 'login' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthMode('signup')}
                    className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
                      authMode === 'signup' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <form onSubmit={authMode === 'login' ? (loginMethod === 'password' ? handleLogin : handleMagicLinkLogin) : handleSignup} className="space-y-4">
                  {authMode === 'login' && (
                    <div className={`flex p-1 rounded-xl border gap-1 ${
                      theme.isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('password')}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                          loginMethod === 'password'
                            ? theme.isDark ? 'bg-slate-800 text-white shadow' : 'bg-white text-slate-800 shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Sign In with Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('magiclink')}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                          loginMethod === 'magiclink'
                            ? theme.isDark ? 'bg-slate-800 text-white shadow' : 'bg-white text-slate-800 shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Sign In with Magic Link
                      </button>
                    </div>
                  )}

                  {authMode === 'signup' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Display Name</label>
                        <button
                          type="button"
                          onClick={handleAutoGenerateUsername}
                          className="text-[9px] font-extrabold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors"
                        >
                          Auto-Generate
                        </button>
                      </div>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                        <input
                          type="text"
                          required
                          autoComplete="username"
                          placeholder="e.g. alex_design"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={`w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
                            theme.isDark 
                              ? 'bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500' 
                              : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="alex@ambrisoft.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
                          theme.isDark 
                            ? 'bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500' 
                            : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </div>

                  {(authMode === 'signup' || (authMode === 'login' && loginMethod === 'password')) && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                        <input
                          type="password"
                          required
                          autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
                            theme.isDark 
                              ? 'bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500' 
                              : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {authMode === 'login' && loginMethod === 'magiclink' && (
                    <div className="flex items-start gap-2.5 p-3 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 text-indigo-400 text-[10px]">
                      <Info size={14} className="shrink-0 mt-0.5" />
                      <div>
                        Passwordless Login is enabled. We will send a secure magic login authorization link directly to your inbox.
                      </div>
                    </div>
                  )}

                  {authMode === 'signup' && (
                    <div className={`p-3 rounded-2xl border text-[11px] space-y-2 ${
                      theme.isDark ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50/50 border-slate-200'
                    }`}>
                      <span className="font-bold text-slate-400 flex items-center gap-1.5">
                        <Info size={12} /> Password Strength Requirements:
                      </span>
                      <div className="grid grid-cols-2 gap-2 font-medium">
                        <span className={`flex items-center gap-1.5 ${passRules.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {passRules.length ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 8+ Characters
                        </span>
                        <span className={`flex items-center gap-1.5 ${passRules.uppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {passRules.uppercase ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 1 Uppercase
                        </span>
                        <span className={`flex items-center gap-1.5 ${passRules.number ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {passRules.number ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 1 Number
                        </span>
                        <span className={`flex items-center gap-1.5 ${passRules.symbol ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {passRules.symbol ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 1 Symbol
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (authMode === 'signup' && !isPasswordValid)}
                    className={`w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow ${
                      authMode === 'signup' && !isPasswordValid
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-indigo-600/20'
                    }`}
                  >
                    {loading ? <RefreshCw className="animate-spin" size={12} /> : null}
                    {authMode === 'login' 
                      ? (loginMethod === 'password' ? 'Sign In to Account' : 'Send Magic Link') 
                      : 'Create Account'}
                  </button>
                </form>
              </div>
            </div>
          )
        ) : (
          /* User Settings Sub-Tab Pages */
          <div className="space-y-6">
            
            {/* View 1: Profile Preferences */}
            {activeSection === 'profile' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Profile Preferences</h3>
                  <p className={`text-xs ${theme.textMuted}`}>Adjust your creator credentials, select avatars, and override theme overrides.</p>
                </div>

                <div className={`p-6 border rounded-2xl space-y-6 ${theme.card}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      {avatarStyle === 'geometric' ? (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-indigo-500/20">
                          {username[0]?.toUpperCase() || 'K'}
                        </div>
                      ) : avatarStyle === 'retro' ? (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-rose-500/20 font-mono">
                          ⚡
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-emerald-500/20">
                          👾
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-bold">{user.user_metadata?.display_name || user.email.split('@')[0]}</h4>
                        <p className={`text-xs ${theme.textMuted}`}>{user.email}</p>
                      </div>
                    </div>

                    {/* Avatar Preset Grid */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Avatar style</label>
                      <div className="flex gap-2">
                        {['geometric', 'retro', 'pixel'].map(style => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => setAvatarStyle(style)}
                            className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all capitalize ${
                              avatarStyle === style 
                                ? theme.isDark ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-white'
                                : theme.isDark ? 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className={theme.border} />

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Creator Handle</label>
                          <button
                            type="button"
                            onClick={handleAutoGenerateUsername}
                            className="text-[9px] font-extrabold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors"
                          >
                            Auto-Generate
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. design_guru"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={`w-full text-xs px-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
                            theme.isDark 
                              ? 'bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500' 
                              : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
                          }`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Creator Bio</label>
                        <input
                          type="text"
                          placeholder="Tell the community about your style..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className={`w-full text-xs px-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
                            theme.isDark 
                              ? 'bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500' 
                              : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
                          }`}
                        />
                      </div>
                    </div>



                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                    >
                      {loading && <RefreshCw size={12} className="animate-spin" />}
                      Save Profile Updates
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* View 2: Security settings */}
            {activeSection === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Security & Devices</h3>
                  <p className={`text-xs ${theme.textMuted}`}>Check linked third-party providers, change account passwords, and examine logins.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Password Form Card */}
                  <div className={`p-6 border rounded-2xl space-y-4 ${theme.card}`}>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Update Credentials</h4>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="relative">
                          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                          <input
                            type={showPass ? 'text' : 'password'}
                            required
                            placeholder="New secure password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full text-xs pl-9 pr-10 py-2.5 rounded-xl border focus:outline-none transition-all ${
                              theme.isDark 
                                ? 'bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500' 
                                : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                          >
                            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || newPassword.length < 8}
                        className={`px-4 py-2.5 text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 ${
                          newPassword.length < 8
                            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                        }`}
                      >
                        Set Password
                      </button>
                    </form>

                    <hr className={theme.border} />

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Linked SSO Providers</span>
                      <div className="flex flex-wrap gap-2">
                        {(user?.app_metadata?.providers || ['email']).map((provider) => (
                          <div 
                            key={provider}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/20 text-[10px] font-bold text-slate-500 dark:text-slate-400 capitalize animate-fadeIn"
                          >
                            {provider === 'email' ? <Mail size={11} /> : provider === 'google' ? <Globe size={11} /> : <Code size={11} />}
                            {provider} Provider (Active)
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Device session registry & log Card */}
                  <div className={`p-6 border rounded-2xl space-y-4 ${theme.card}`}>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Active Logs & Registry</h4>
                    <div className="space-y-3">
                      <div className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                        theme.isDark ? 'bg-slate-950/20 border-slate-850' : 'bg-slate-50/50 border-slate-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                            <Laptop size={16} />
                          </div>
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              {sessionAgent}
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-extrabold text-[8px] uppercase tracking-wider">Current Device</span>
                            </div>
                            <span className={`text-[10px] ${theme.textMuted}`}>IP: {clientIp}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleRevokeOthers}
                          disabled={loading}
                          className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 active:scale-95 text-red-400 text-[10px] font-bold rounded-lg transition-all"
                        >
                          Revoke Others
                        </button>
                      </div>

                      <div className="space-y-2 mt-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Security Audit trail</span>
                        <div className="space-y-1.5">
                          {activityLogs.map((log, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] font-semibold border-b dark:border-slate-850/50 pb-1.5">
                              <span className="text-slate-300">{log.event}</span>
                              <span className="text-slate-500">{log.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Cloud backups */}
            {activeSection === 'backup' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Cloud Archiver</h3>
                  <p className={`text-xs ${theme.textMuted}`}>Automate cloud backup syncing, inspect storage limits, download snapshots, or clear remote files.</p>
                </div>

                <div className="space-y-4 max-w-xl">
                  {/* Cloud Storage & Quota Meter Card */}
                  <div className={`p-6 border rounded-3xl space-y-5 ${theme.card} relative overflow-hidden`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b dark:border-slate-800 border-slate-200 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                          <Database size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">Cloud Storage & Quota Meter</h4>
                          <p className={`text-[10px] ${theme.textMuted}`}>Free Creator Tier Quota Enforcement</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                        ⚡ Active Free Tier
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Meter 1: Storage Bytes */}
                      <div className={`p-4 rounded-2xl border space-y-2 ${theme.isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-400 text-[11px]">Storage Capacity</span>
                          <span className="font-mono text-indigo-400">
                            {formatBytes(storageQuota.used_bytes)} / {formatBytes(storageQuota.max_bytes)}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              (storageQuota.used_bytes / (storageQuota.max_bytes || 1)) > 0.85
                                ? 'bg-rose-500'
                                : (storageQuota.used_bytes / (storageQuota.max_bytes || 1)) > 0.6
                                  ? 'bg-amber-500'
                                  : 'bg-indigo-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.round((storageQuota.used_bytes / (storageQuota.max_bytes || 1)) * 100))}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-medium opacity-70">
                          <span>{Math.round((storageQuota.used_bytes / (storageQuota.max_bytes || 1)) * 100)}% Used</span>
                          <span>{formatBytes(Math.max(0, storageQuota.max_bytes - storageQuota.used_bytes))} Free</span>
                        </div>
                      </div>

                      {/* Meter 2: Image Slots */}
                      <div className={`p-4 rounded-2xl border space-y-2 ${theme.isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-400 text-[11px]">Saved Image Slots</span>
                          <span className="font-mono text-emerald-400">
                            {storageQuota.image_count} / {storageQuota.max_images} Slots
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              (storageQuota.image_count / (storageQuota.max_images || 1)) > 0.85
                                ? 'bg-rose-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.round((storageQuota.image_count / (storageQuota.max_images || 1)) * 100))}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-medium opacity-70">
                          <span>{Math.round((storageQuota.image_count / (storageQuota.max_images || 1)) * 100)}% Used</span>
                          <span>{Math.max(0, storageQuota.max_images - storageQuota.image_count)} Left</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-300">
                      <Sparkles size={14} className="shrink-0 text-indigo-400" />
                      <span className="text-[11px]">Images are automatically compressed to WebP client-side before upload, saving ~98% storage space!</span>
                    </div>
                  </div>

                  {/* Preferences: Auto sync Option */}
                  <div className={`p-5 border rounded-2xl flex items-center justify-between gap-4 ${theme.card}`}>
                    <div className="space-y-1">
                      <span className="text-sm font-bold block">Auto-Sync Creations</span>
                      <p className={`text-xs ${theme.textMuted}`}>Instantly backup shared color palettes & patterns to the database.</p>
                    </div>
                    <button
                      onClick={() => handleToggleAutoSync(!autoSync)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        autoSync ? 'bg-indigo-600' : 'bg-slate-850'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          autoSync ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Database sync option */}
                  <div className={`p-5 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme.card}`}>
                    <div className="space-y-1">
                      <span className="text-sm font-bold block">Offline Data Migration</span>
                      <p className={`text-xs ${theme.textMuted}`}>
                        {totalOfflineCount > 0 
                          ? `Sync ${totalOfflineCount} offline assets stored in local storage to your database.` 
                          : "No offline local assets require backup sync."}
                      </p>
                    </div>
                    <button
                      disabled={totalOfflineCount === 0 || loading}
                      onClick={handleSyncVault}
                      className={`py-2 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow ${
                        totalOfflineCount === 0 
                          ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500 border border-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-indigo-600/20'
                      }`}
                    >
                      {loading ? <RefreshCw className="animate-spin" size={12} /> : <RefreshCw size={12} />}
                      Sync Offline Vault
                    </button>
                  </div>

                  {/* Bulk backup option */}
                  <div className={`p-5 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme.card}`}>
                    <div className="space-y-1">
                      <span className="text-sm font-bold block">Download Local Backup Archive</span>
                      <p className={`text-xs ${theme.textMuted}`}>Download a single structured JSON bundle containing all saved presets.</p>
                    </div>
                    <button
                      onClick={handleDownloadBackup}
                      className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                    >
                      <Download size={12} /> Download Backup
                    </button>
                  </div>



                  {/* Danger Zone */}
                  <div className="p-5 border border-red-500/25 bg-red-500/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-red-400 block">Clear Cloud Storage</span>
                      <p className="text-xs text-red-500/70">Wipe all palettes and patterns published from this account. This cannot be undone.</p>
                    </div>
                    <button
                      onClick={handleDeleteCloudData}
                      className="py-2 px-4 bg-red-600 hover:bg-red-500 active:scale-95 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 shadow-lg shadow-red-600/20 transition-all"
                    >
                      <Trash2 size={12} /> Clear Cloud data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View 4: Developer Access - Replaced with Coming Soon tag */}
            {activeSection === 'developer' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Developer API Console</h3>
                  <p className={`text-xs ${theme.textMuted}`}>Connect external CLI utilities or fetch design metadata using curl.</p>
                </div>

                <div className={`p-8 border rounded-2xl flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden min-h-[300px] ${theme.card}`}>
                  {/* Subtle decorative background glow */}
                  <div className="absolute w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl -top-10 -right-10 pointer-events-none" />
                  <div className="absolute w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl -bottom-10 -left-10 pointer-events-none" />

                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/5 border border-indigo-500/20">
                    <Code size={24} />
                  </div>
                  
                  <div className="space-y-2 max-w-md">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-extrabold text-[8px] uppercase tracking-wider inline-block">Coming Soon</span>
                    <h4 className="text-base font-bold">Krasola Developer API Suite</h4>
                    <p className={`text-xs ${theme.textMuted}`}>
                      We are currently engineering personal access tokens, developer dashboards, and webhook integrations. Subscribe to receive beta access notification when we deploy.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (showToast) showToast('Subscribed to Developer API Beta!');
                    }}
                    className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    Request Beta Access
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
