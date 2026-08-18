/**
 * Krasola Version & Release Lifecycle Manager
 * Centralized Single Source of Truth for SemVer, Commit Hashes, and PWA Updates
 */

export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.4.0';
export const COMMIT_HASH = typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'main';
export const BUILD_TIMESTAMP = typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : new Date().toISOString();
export const APP_STAGE = typeof __APP_STAGE__ !== 'undefined' ? __APP_STAGE__ : 'Production';

/**
 * Format the build date into a clean, human-readable string
 */
export const getFormattedBuildDate = () => {
  try {
    return new Date(BUILD_TIMESTAMP).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Recently';
  }
};

/**
 * Check if a newer version is deployed on the server
 * @returns {Promise<{ hasUpdate: boolean, latestVersion: string, currentVersion: string, latestCommit: string, currentCommit: string }>}
 */
export const checkForAppUpdates = async () => {
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      return { hasUpdate: false, latestVersion: APP_VERSION, currentVersion: APP_VERSION };
    }

    const data = await response.json();
    const latestVersion = data.version || APP_VERSION;
    const latestCommit = data.commit || COMMIT_HASH;

    const hasUpdate = latestVersion !== APP_VERSION || (latestCommit !== COMMIT_HASH && latestCommit !== 'main');

    return {
      hasUpdate,
      latestVersion,
      currentVersion: APP_VERSION,
      latestCommit,
      currentCommit: COMMIT_HASH
    };
  } catch (e) {
    console.warn('Update check failed:', e);
    return { hasUpdate: false, latestVersion: APP_VERSION, currentVersion: APP_VERSION };
  }
};

/**
 * Purge stale Service Worker caches and perform an instant seamless application reload
 */
export const applyAppUpdate = async () => {
  try {
    if (typeof window !== 'undefined') {
      // 1. Unregister or skipWaiting on Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
          await registration.update().catch(() => {});
        }
      }

      // 2. Clear caches if accessible
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(k => caches.delete(k)));
      }

      // 3. Force reload ignoring cache
      window.location.reload();
    }
  } catch (err) {
    console.warn('Error applying app update:', err);
    window.location.reload();
  }
};
