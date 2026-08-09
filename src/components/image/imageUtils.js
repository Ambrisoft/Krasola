// Image Search Studio Utilities: API Fetchers, Multi-Tier Fallback, Color Extraction & Canvas Helpers

// Curated high-resolution CC0 offline fallback dataset
export const CURATED_FALLBACK_IMAGES = [
  {
    id: 'fb-1',
    title: 'Neon Cyberpunk City Night',
    creator: 'Alexandre Debiève',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    license: 'CC0 / Public Domain',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'Unsplash (Offline Vault)',
    width: 1920,
    height: 1080
  },
  {
    id: 'fb-2',
    title: 'Minimalist Mountain Fog',
    creator: 'Eberhard Grossgasteiger',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
    license: 'CC0 / Public Domain',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'Unsplash (Offline Vault)',
    width: 1920,
    height: 1280
  },
  {
    id: 'fb-3',
    title: 'Abstract Gradient Fluid Glass',
    creator: 'Pawel Czerwinski',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    license: 'CC0 / Public Domain',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'Unsplash (Offline Vault)',
    width: 1920,
    height: 1080
  },
  {
    id: 'fb-4',
    title: 'Emerald Forest Aerial Canopy',
    creator: 'Olga DeDovyna',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80',
    license: 'CC0 / Public Domain',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'Unsplash (Offline Vault)',
    width: 1920,
    height: 1280
  },
  {
    id: 'fb-5',
    title: 'Vibrant Sunset Coastline',
    creator: 'Sean Oulashin',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=400&q=80',
    license: 'CC0 / Public Domain',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'Unsplash (Offline Vault)',
    width: 1920,
    height: 1080
  },
  {
    id: 'fb-6',
    title: 'Geometric Modern Architecture',
    creator: 'Joel Felipe',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    license: 'CC0 / Public Domain',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'Unsplash (Offline Vault)',
    width: 1920,
    height: 1280
  }
];

// Sanitize HTTP to HTTPS
export function sanitizeHttpsUrl(url) {
  if (!url) return '';
  return url.replace(/^http:/i, 'https:');
}

// Layer 1: Openverse API search
export async function searchOpenverseImages(query, { orientation, license } = {}) {
  try {
    let endpoint = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=20`;
    if (orientation && orientation !== 'all') {
      endpoint += `&aspect_ratio=${orientation}`;
    }
    if (license && license !== 'all') {
      endpoint += `&license_type=${license}`;
    }

    const res = await fetch(endpoint, { headers: { 'User-Agent': 'Krasola/1.0' } });
    if (!res.ok) throw new Error(`Openverse API HTTP ${res.status}`);
    
    const data = await res.json();
    if (!data.results || data.results.length === 0) return [];

    return data.results.map((item) => ({
      id: `ov-${item.id}`,
      title: item.title || query,
      creator: item.creator || 'Openverse Author',
      url: sanitizeHttpsUrl(item.url),
      thumbnail: sanitizeHttpsUrl(item.thumbnail || item.url),
      license: item.license ? `CC ${item.license.toUpperCase()}` : 'CC Licensed',
      license_url: item.license_url || 'https://creativecommons.org',
      source: 'Openverse API',
      width: item.width || 1200,
      height: item.height || 800
    }));
  } catch (err) {
    console.warn('Layer 1 (Openverse API) failed/rate-limited:', err.message);
    return null; // Signals to fallback to Layer 2
  }
}

// Layer 2: Wikimedia Commons API search
export async function searchWikimediaImages(query) {
  try {
    const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsearchtype=file&gsearch=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=600&format=json&origin=*`;
    
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`Wikimedia API HTTP ${res.status}`);
    
    const data = await res.json();
    if (!data.query || !data.query.pages) return [];

    const pages = Object.values(data.query.pages);
    const results = [];

    for (const page of pages) {
      if (page.imageinfo && page.imageinfo[0]) {
        const info = page.imageinfo[0];
        // Filter image mime types
        if (info.mime && info.mime.startsWith('image/')) {
          const meta = info.extmetadata || {};
          results.push({
            id: `wm-${page.pageid}`,
            title: page.title.replace(/^File:/i, '').replace(/\.[^/.]+$/, ''),
            creator: meta.Artist ? meta.Artist.value.replace(/<[^>]*>?/gm, '') : 'Wikimedia Commons',
            url: sanitizeHttpsUrl(info.url),
            thumbnail: sanitizeHttpsUrl(info.thumburl || info.url),
            license: meta.LicenseShortName ? meta.LicenseShortName.value : 'Public Domain / CC',
            license_url: meta.LicenseUrl ? meta.LicenseUrl.value : 'https://commons.wikimedia.org',
            source: 'Wikimedia Commons',
            width: info.width || 1200,
            height: info.height || 800
          });
        }
      }
    }
    return results;
  } catch (err) {
    console.warn('Layer 2 (Wikimedia Commons API) failed:', err.message);
    return null; // Signals to fallback to Layer 3
  }
}

// Client-side persistent search cache (survives browser refreshes and tab navigations)
function loadSearchCacheFromStorage() {
  try {
    const saved = localStorage.getItem('image_search_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      return new Map(Object.entries(parsed));
    }
  } catch (err) {
    console.warn('Failed to load image_search_cache from localStorage:', err);
  }
  return new Map();
}

function saveSearchCacheToStorage(cacheMap) {
  try {
    // Keep max 50 cached queries to prevent local storage quota overflow
    const entries = Array.from(cacheMap.entries()).slice(-50);
    const obj = Object.fromEntries(entries);
    localStorage.setItem('image_search_cache', JSON.stringify(obj));
  } catch (err) {
    console.warn('Failed to save image_search_cache to localStorage:', err);
  }
}

const searchCache = loadSearchCacheFromStorage();

export function clearSearchCache() {
  searchCache.clear();
  localStorage.removeItem('image_search_cache');
}

// Multi-Tier Fallback Controller: Cache -> Openverse -> Wikimedia -> Offline Curated Dataset
export async function searchImagesWithFallback(query, filters = {}) {
  const cleanQuery = (query || 'home').toLowerCase().trim();
  const cacheKey = `${cleanQuery}_${filters.orientation || 'all'}_${filters.license || 'all'}`;

  // Check client-side memory & storage cache first
  if (searchCache.has(cacheKey)) {
    const cached = searchCache.get(cacheKey);
    return {
      results: cached.results,
      provider: `${cached.provider} ⚡ (Cached Local)`
    };
  }

  let finalPayload = null;

  // Try Layer 1: Openverse
  const openverseResults = await searchOpenverseImages(cleanQuery, filters);
  if (openverseResults && openverseResults.length > 0) {
    finalPayload = { results: openverseResults, provider: 'Openverse API (Layer 1)' };
  } else {
    // Try Layer 2: Wikimedia Commons
    const wikimediaResults = await searchWikimediaImages(cleanQuery);
    if (wikimediaResults && wikimediaResults.length > 0) {
      finalPayload = { results: wikimediaResults, provider: 'Wikimedia Commons (Layer 2 Fallback)' };
    } else {
      // Layer 3: Offline Curated Fallback Dataset
      const filteredOffline = CURATED_FALLBACK_IMAGES.filter(img => 
        !cleanQuery || img.title.toLowerCase().includes(cleanQuery) || cleanQuery === 'home' || cleanQuery === 'all'
      );
      finalPayload = {
        results: filteredOffline.length > 0 ? filteredOffline : CURATED_FALLBACK_IMAGES,
        provider: 'Offline Curated Vault (Layer 3 Fallback)'
      };
    }
  }

  // Save to client memory & localStorage cache
  if (finalPayload) {
    searchCache.set(cacheKey, finalPayload);
    saveSearchCacheToStorage(searchCache);
  }

  return finalPayload;
}

// Client-side offscreen Canvas HSL Color Quantization (Extract Top 5 Dominant Colors)
export function extractDominantPalette(imageSrc, sampleCount = 5) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Scale down to 120x120 for fast client computation
        canvas.width = 120;
        canvas.height = 120;
        ctx.drawImage(img, 0, 0, 120, 120);

        const imgData = ctx.getImageData(0, 0, 120, 120);
        const data = imgData.data;
        const colorCounts = {};

        // Sample every 4th pixel for high speed
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip low alpha
          if (a < 128) continue;

          // Quantize RGB to 16-step grid
          const qR = Math.round(r / 32) * 32;
          const qG = Math.round(g / 32) * 32;
          const qB = Math.round(b / 32) * 32;

          const hex = `#${((1 << 24) + (qR << 16) + (qG << 8) + qB).toString(16).slice(1)}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        // Sort colors by frequency
        const sortedHexes = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);

        // Take top N unique colors
        let palette = sortedHexes.slice(0, sampleCount);

        // Fallback default swatches if image was monotone or empty
        const defaultPalette = ['#1e293b', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
        while (palette.length < sampleCount) {
          palette.push(defaultPalette[palette.length % defaultPalette.length]);
        }

        resolve(palette);
      } catch (err) {
        console.warn('Canvas color extraction CORS restriction:', err);
        // Fallback aesthetic palette on CORS restriction
        resolve(['#0f172a', '#6366f1', '#38bdf8', '#34d399', '#f43f5e']);
      }
    };

    img.onerror = () => {
      resolve(['#1e293b', '#6366f1', '#06b6d4', '#10b981', '#f59e0b']);
    };

    img.src = imageSrc;
  });
}

// Generate CSS filter string for Canvas photo editor
export function getCanvasFilterString({ brightness = 100, contrast = 100, saturation = 100, blur = 0, hue = 0, sepia = 0 }) {
  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) hue-rotate(${hue}deg) sepia(${sepia}%)`;
}
