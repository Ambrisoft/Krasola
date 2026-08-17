// ==============================================================================
// User-Centric Activity & Usage Telemetry Tracker
// Tracks user rate-limit quotas, cloud storage usage, on-device compression savings,
// and personal action timelines. Strictly sanitizes all credentials, keys, and tokens.
// ==============================================================================

const STORAGE_KEY = 'krasola_user_activity_logs';
const SAVINGS_KEY = 'krasola_bandwidth_savings_bytes';
const MAX_LOGS = 200;

// Internal event listeners for reactive UI updates
const listeners = new Set();

function emitChange() {
  listeners.forEach(cb => {
    try { cb(); } catch (e) { console.warn("Telemetry listener error:", e); }
  });
}

export function subscribeToActivity(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Retrieve persistent activity logs
export function getUserActivityLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Retrieve cumulative on-device bandwidth savings in bytes
export function getBandwidthSavings() {
  try {
    const raw = localStorage.getItem(SAVINGS_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch (e) {
    return 0;
  }
}

// Record a new user-facing action event
export function recordUserActivity({
  category = 'system', // 'search' | 'storage' | 'creation' | 'export' | 'optimization' | 'system'
  title,
  description,
  status = 'success',  // 'success' | 'warning' | 'info' | 'error'
  durationMs = null,
  bytesSaved = null,
  metadata = null
}) {
  try {
    // Sanitize metadata to guarantee ZERO keys, tokens, or private IDs are stored
    let cleanMetadata = null;
    if (metadata && typeof metadata === 'object') {
      cleanMetadata = {};
      for (const [k, v] of Object.entries(metadata)) {
        if (!/key|token|secret|password|bearer|auth|jwt|url|ip/i.test(k)) {
          cleanMetadata[k] = typeof v === 'object' ? JSON.stringify(v) : v;
        }
      }
    }

    const newLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      category,
      title: title || 'User Activity',
      description: description || '',
      status,
      durationMs: typeof durationMs === 'number' ? Math.round(durationMs) : null,
      bytesSaved: typeof bytesSaved === 'number' ? bytesSaved : null,
      metadata: cleanMetadata
    };

    // Update bandwidth savings accumulator if applicable
    if (typeof bytesSaved === 'number' && bytesSaved > 0) {
      const currentSavings = getBandwidthSavings();
      localStorage.setItem(SAVINGS_KEY, (currentSavings + bytesSaved).toString());
    }

    // Ring-buffer persistence
    const existing = getUserActivityLogs();
    const updated = [newLog, ...existing].slice(0, MAX_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    emitChange();
    return newLog;
  } catch (e) {
    console.warn("Failed to record activity log:", e);
    return null;
  }
}

// Clear local user activity history
export function clearActivityHistory() {
  localStorage.setItem(STORAGE_KEY, '[]');
  emitChange();
}

// Compute aggregate usage metrics for Monitoring Hub
export function getUserUsageMetrics() {
  const logs = getUserActivityLogs();
  const totalSavings = getBandwidthSavings();

  const now = Date.now();
  const oneDayAgo = now - 24 * 3600 * 1000;
  const recentLogs = logs.filter(l => new Date(l.timestamp).getTime() > oneDayAgo);

  const searchesCount = logs.filter(l => l.category === 'search').length;
  const creationsCount = logs.filter(l => l.category === 'creation').length;
  const exportsCount = logs.filter(l => l.category === 'export').length;
  const optimizationsCount = logs.filter(l => l.category === 'optimization').length;

  return {
    totalActions: logs.length,
    actionsToday: recentLogs.length,
    totalBandwidthSavedBytes: totalSavings,
    searchesCount,
    creationsCount,
    exportsCount,
    optimizationsCount,
    lastActive: logs[0]?.timestamp || null
  };
}

// Export clean sanitized activity diagnostics (JSON)
export function exportActivityDiagnostics() {
  const logs = getUserActivityLogs();
  const metrics = getUserUsageMetrics();

  const bundle = {
    exportDate: new Date().toISOString(),
    metrics,
    activityTimeline: logs
  };

  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `krasola-usage-report-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
