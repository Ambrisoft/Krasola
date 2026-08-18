/**
 * Krasola Version & Release Lifecycle Manager
 * Centralized Single Source of Truth for SemVer, Commit Hashes, and PWA Updates
 */

export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.3.0';
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
 * @returns {Promise<{ hasUpdate: boolean, latestVersion: string, currentVersion: string }>}
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
