import { useState, useEffect } from 'react';

let deferredPrompt = null;
const promptListeners = new Set();

if (typeof window !== 'undefined') {
  // Capture native browser install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    promptListeners.forEach(cb => cb(true));
  });

  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    promptListeners.forEach(cb => cb(false));
    console.log("Krasola PWA was successfully installed.");
  });
}

export function isStandaloneApp() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function isIOSDevice() {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('Krasola ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('Krasola ServiceWorker registration failed:', err);
        });
    });
  }
}

export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(!!deferredPrompt);
  const [isInstalled, setIsInstalled] = useState(isStandaloneApp());
  const [isIOS, setIsIOS] = useState(isIOSDevice());

  useEffect(() => {
    setIsInstalled(isStandaloneApp());
    setIsIOS(isIOSDevice());

    const handleChange = (available) => {
      setCanInstall(available);
      setIsInstalled(isStandaloneApp());
    };

    promptListeners.add(handleChange);
    return () => promptListeners.delete(handleChange);
  }, []);

  const triggerInstallPrompt = async () => {
    if (!deferredPrompt) {
      return { success: false, reason: 'no_prompt' };
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        deferredPrompt = null;
        setCanInstall(false);
        return { success: true, outcome: 'accepted' };
      } else {
        return { success: false, outcome: 'dismissed' };
      }
    } catch (err) {
      console.warn("Error triggering PWA prompt:", err);
      return { success: false, error: err };
    }
  };

  return {
    canInstall,
    isInstalled,
    isIOS,
    triggerInstallPrompt
  };
}
