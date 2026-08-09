// Helper functions for color calculations, manipulation, dynamic harmony rules & WCAG accessibility

export function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Generate aesthetic HSL values
export function generateRandomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 25) + 65; // 65-90% for clean saturation
  const l = Math.floor(Math.random() * 25) + 45; // 45-70% for legible contrast
  return hslToHex(h, s, l);
}

// Calculate relative luminance for WCAG contrast checking
export function getRelativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Contrast ratio between two colors
export function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
}

// Dynamic Harmonious Palette Generator for N Swatches (2 to 10 swatches)
export function generateHarmoniousPalette(baseHex, rule, count = 5) {
  const hsl = hexToHsl(baseHex);
  const colors = [];
  const s = hsl.s;
  const l = hsl.l;

  switch (rule) {
    case 'monochromatic': {
      // Varies lightness smoothly from 15% to 85% across N swatches
      const step = 70 / Math.max(1, count - 1);
      for (let i = 0; i < count; i++) {
        const targetL = Math.round(15 + i * step);
        colors.push(hslToHex(hsl.h, s, targetL));
      }
      break;
    }
    case 'analogous': {
      // Spreads N swatches evenly across a 120-degree arc around base hue (-60 to +60)
      const step = 120 / Math.max(1, count - 1);
      for (let i = 0; i < count; i++) {
        const targetH = (hsl.h - 60 + i * step + 360) % 360;
        colors.push(hslToHex(targetH, s, l));
      }
      break;
    }
    case 'complementary': {
      // Half around base hue, half around complementary hue (+180)
      const half = Math.ceil(count / 2);
      for (let i = 0; i < count; i++) {
        const baseAngle = i < half ? hsl.h : (hsl.h + 180) % 360;
        const offset = ((i % half) - (half / 2)) * 15;
        const targetH = (baseAngle + offset + 360) % 360;
        colors.push(hslToHex(targetH, s, l));
      }
      break;
    }
    case 'triadic': {
      // Distributes N swatches across 3 triadic nodes (H, H+120, H+240)
      for (let i = 0; i < count; i++) {
        const node = (i % 3) * 120;
        const variation = Math.floor(i / 3) * 12;
        const targetH = (hsl.h + node + variation) % 360;
        colors.push(hslToHex(targetH, s, l));
      }
      break;
    }
    case 'split-complementary': {
      // Distributes across H, H+150, and H+210
      const angles = [hsl.h, (hsl.h + 150) % 360, (hsl.h + 210) % 360];
      for (let i = 0; i < count; i++) {
        const targetH = angles[i % 3];
        const targetL = Math.min(90, Math.max(15, l + (Math.floor(i / 3) * 15 - 10)));
        colors.push(hslToHex(targetH, s, targetL));
      }
      break;
    }
    default: {
      colors.push(baseHex);
      for (let i = 1; i < count; i++) {
        colors.push(generateRandomColor());
      }
    }
  }

  return colors;
}

// Adobe-Grade Swatch Insertion Logic: Shortest-Arc Vector Interpolation & Rule Alignment
export function getHarmoniousInsertedColor(colors, insertIdx, harmonyRule) {
  // If active mathematical harmony rule is selected, use rule base anchor for N+1 swatches
  if (harmonyRule && harmonyRule !== 'random') {
    const baseIdx = colors.findIndex(c => !c.isLocked);
    const baseHex = baseIdx !== -1 ? colors[baseIdx].hex : colors[0].hex;
    const newCount = colors.length + 1;
    const newHarmoniousPalette = generateHarmoniousPalette(baseHex, harmonyRule, newCount);
    return newHarmoniousPalette[insertIdx + 1] || newHarmoniousPalette[newHarmoniousPalette.length - 1];
  }

  // Otherwise (Random Mode): Shortest-arc HSL vector midpoint interpolation
  const leftColor = colors[insertIdx];
  const rightColor = colors[insertIdx + 1] || colors[0];

  const hslA = hexToHsl(leftColor.hex);
  const hslB = hexToHsl(rightColor.hex);

  // Shortest arc distance around 360-degree color wheel
  let deltaH = (hslB.h - hslA.h + 540) % 360 - 180;
  let newH = (hslA.h + deltaH / 2 + 360) % 360;

  let newS = Math.round((hslA.s + hslB.s) / 2);
  let newL = Math.round((hslA.l + hslB.l) / 2);

  // Subtle natural variation to prevent flat duplicates
  newS = Math.min(95, Math.max(20, newS + Math.floor(Math.random() * 5 - 2)));
  newL = Math.min(90, Math.max(15, newL + Math.floor(Math.random() * 5 - 2)));

  return hslToHex(Math.round(newH), newS, newL);
}

// Automated WCAG AA Contrast Optimizer: Adjusts lightness of low-contrast swatches
export function optimizePaletteForWCAG(swatches) {
  return swatches.map((item, idx) => {
    if (item.isLocked) return item;
    const hsl = hexToHsl(item.hex);
    
    // Check contrast against dark background (#0f172a)
    let ratio = getContrastRatio(item.hex, '#0f172a');
    let newL = hsl.l;

    if (ratio < 4.5) {
      // Boost lightness to ensure WCAG AA readability
      newL = Math.min(88, hsl.l + 25);
    }
    
    return {
      ...item,
      hex: hslToHex(hsl.h, hsl.s, newL)
    };
  });
}

// Color Blindness Simulation Algorithms (Includes Protanomaly & Deuteranomaly)
export function simulateColorBlindness(hex, type) {
  const rgb = hexToRgb(hex);
  let r = rgb.r, g = rgb.g, b = rgb.b;

  switch (type) {
    case 'protanopia': // Red-blind
      r = Math.round(0.567 * rgb.r + 0.433 * rgb.g);
      g = Math.round(0.558 * rgb.r + 0.442 * rgb.g);
      b = Math.round(0.242 * rgb.g + 0.758 * rgb.b);
      break;
    case 'protanomaly': // Red-weak
      r = Math.round(0.817 * rgb.r + 0.183 * rgb.g);
      g = Math.round(0.333 * rgb.r + 0.667 * rgb.g);
      b = Math.round(0.125 * rgb.g + 0.875 * rgb.b);
      break;
    case 'deuteranopia': // Green-blind
      r = Math.round(0.625 * rgb.r + 0.375 * rgb.g);
      g = Math.round(0.700 * rgb.r + 0.300 * rgb.g);
      b = Math.round(0.300 * rgb.g + 0.700 * rgb.b);
      break;
    case 'deuteranomaly': // Green-weak
      r = Math.round(0.800 * rgb.r + 0.200 * rgb.g);
      g = Math.round(0.258 * rgb.r + 0.742 * rgb.g);
      b = Math.round(0.142 * rgb.g + 0.858 * rgb.b);
      break;
    case 'tritanopia': // Blue-blind
      r = Math.round(0.950 * rgb.r + 0.050 * rgb.g);
      g = Math.round(0.433 * rgb.r + 0.567 * rgb.b);
      b = Math.round(0.475 * rgb.g + 0.525 * rgb.b);
      break;
    case 'achromatopsia': // Grayscale
      const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
      r = g = b = gray;
      break;
    default:
      break;
  }

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return rgbToHex(r, g, b);
}

// Adobe-Grade MMCQ (Modified Median Cut Quantization) Image Color Extraction Engine
export function extractMMCQPalette(pixelData, count = 5, mood = 'vibrant') {
  // 1. Build 5-bit color histogram (32x32x32 = 32768 bins)
  const histo = new Array(32768).fill(0);
  const pixels = [];

  for (let i = 0; i < pixelData.length; i += 4) {
    const a = pixelData[i + 3];
    if (a < 125) continue; // Skip transparency

    const r = pixelData[i] >> 3;
    const g = pixelData[i + 1] >> 3;
    const b = pixelData[i + 2] >> 3;
    const index = (r << 10) + (g << 5) + b;
    histo[index] = (histo[index] || 0) + 1;
    pixels.push([pixelData[i], pixelData[i + 1], pixelData[i + 2]]);
  }

  if (pixels.length === 0) return [];

  // Find min/max bounds across R, G, B
  let rmin = 32, rmax = 0, gmin = 32, gmax = 0, bmin = 32, bmax = 0;
  for (let i = 0; i < 32768; i++) {
    if (histo[i]) {
      const r = i >> 10;
      const g = (i >> 5) & 31;
      const b = i & 31;
      if (r < rmin) rmin = r;
      if (r > rmax) rmax = r;
      if (g < gmin) gmin = g;
      if (g > gmax) gmax = g;
      if (b < bmin) bmin = b;
      if (b > bmax) bmax = b;
    }
  }

  // Recursive Median Cut Box Splitting Helper
  const vbox = { r1: rmin, r2: rmax, g1: gmin, g2: gmax, b1: bmin, b2: bmax };
  const vboxes = [vbox];

  const getVBoxVolume = (b) => (b.r2 - b.r1 + 1) * (b.g2 - b.g1 + 1) * (b.b2 - b.b1 + 1);

  const getVBoxAvg = (b) => {
    let ntot = 0, rsum = 0, gsum = 0, bsum = 0;
    for (let r = b.r1; r <= b.r2; r++) {
      for (let g = b.g1; g <= b.g2; g++) {
        for (let k = b.b1; k <= b.b2; k++) {
          const idx = (r << 10) + (g << 5) + k;
          const h = histo[idx] || 0;
          ntot += h;
          rsum += h * (r + 0.5) * 8;
          gsum += h * (g + 0.5) * 8;
          bsum += h * (k + 0.5) * 8;
        }
      }
    }
    if (ntot > 0) {
      return [Math.round(rsum / ntot), Math.round(gsum / ntot), Math.round(bsum / ntot)];
    }
    return [Math.round((b.r1 + b.r2 + 1) * 4), Math.round((b.g1 + b.g2 + 1) * 4), Math.round((b.b1 + b.b2 + 1) * 4)];
  };

  // Perform box splits until target count is reached
  let iterations = 0;
  while (vboxes.length < count * 3 && iterations < 100) {
    iterations++;
    vboxes.sort((a, b) => getVBoxVolume(b) - getVBoxVolume(a));
    const targetBox = vboxes.shift();
    if (!targetBox) break;

    const rw = targetBox.r2 - targetBox.r1;
    const gw = targetBox.g2 - targetBox.g1;
    const bw = targetBox.b2 - targetBox.b1;
    const maxw = Math.max(rw, gw, bw);

    if (maxw <= 0) {
      vboxes.push(targetBox);
      break;
    }

    if (maxw === rw) {
      const med = Math.floor((targetBox.r1 + targetBox.r2) / 2);
      vboxes.push({ ...targetBox, r2: med });
      vboxes.push({ ...targetBox, r1: med + 1 });
    } else if (maxw === gw) {
      const med = Math.floor((targetBox.g1 + targetBox.g2) / 2);
      vboxes.push({ ...targetBox, g2: med });
      vboxes.push({ ...targetBox, g1: med + 1 });
    } else {
      const med = Math.floor((targetBox.b1 + targetBox.b2) / 2);
      vboxes.push({ ...targetBox, b2: med });
      vboxes.push({ ...targetBox, b1: med + 1 });
    }
  }

  // Extract raw RGB colors from VBoxes
  let extracted = vboxes.map(b => {
    const [r, g, bColor] = getVBoxAvg(b);
    return rgbToHex(r, g, bColor);
  });

  // Mood-Based Filtering & Perceptual Distance (Delta-E / HSL)
  const scoredColors = extracted.map(hex => {
    const hsl = hexToHsl(hex);
    let score = 0;

    switch (mood) {
      case 'vibrant':
        score = hsl.s * 1.5 + (1 - Math.abs(hsl.l - 50) / 50);
        if (hsl.l < 10 || hsl.l > 92) score -= 2; // Filter near-black and near-white background noise
        break;
      case 'colorful':
        score = hsl.s * 2.0;
        break;
      case 'muted':
        score = (1 - hsl.s / 100) * 1.5 + (1 - Math.abs(hsl.l - 50) / 50);
        break;
      case 'deep':
        score = (1 - hsl.l / 100) * 2.0 + (hsl.s / 100);
        break;
      case 'light':
        score = (hsl.l / 100) * 2.0 + (hsl.s / 100);
        break;
      default:
        score = hsl.s + hsl.l / 100;
        break;
    }

    return { hex, score, hsl };
  }).sort((a, b) => b.score - a.score);

  // Perceptual distance filter to eliminate duplicate/colliding colors
  const resultHexes = [];
  for (const item of scoredColors) {
    if (resultHexes.length >= count) break;
    const isDistinct = resultHexes.every(existingHex => {
      const h1 = hexToHsl(existingHex);
      const h2 = item.hsl;
      const deltaH = Math.abs((h1.h - h2.h + 540) % 360 - 180);
      const deltaS = Math.abs(h1.s - h2.s);
      const deltaL = Math.abs(h1.l - h2.l);
      return deltaH > 12 || deltaS > 15 || deltaL > 15;
    });

    if (isDistinct || resultHexes.length === 0) {
      resultHexes.push(item.hex);
    }
  }

  // Fallback if distinct count is under requested count
  for (const item of scoredColors) {
    if (resultHexes.length >= count) break;
    if (!resultHexes.includes(item.hex)) {
      resultHexes.push(item.hex);
    }
  }

  // Mathematical Harmony Alignment Mode (Monochromatic, Analogous, Complementary, Triadic, Split-Complementary)
  const mathHarmonyRules = ['monochromatic', 'analogous', 'complementary', 'triadic', 'split-complementary'];
  if (mathHarmonyRules.includes(mood)) {
    const primaryHex = resultHexes[0] || scoredColors[0]?.hex || '#6366f1';
    return generateHarmoniousPalette(primaryHex, mood, count);
  }

  return resultHexes;
}

// Adobe-Grade MMCQ Image Color Extraction Engine with Interactive Marker Pin Coordinates
export function extractMMCQWithCoordinates(ctx, width, height, count = 5, mood = 'colorful') {
  const imgData = ctx.getImageData(0, 0, width, height).data;
  const pixels = [];

  // Sample pixels with coordinates
  const step = Math.max(1, Math.floor((width * height) / 10000));
  for (let y = 0; y < height; y += Math.max(1, Math.floor(step / 2))) {
    for (let x = 0; x < width; x += Math.max(1, Math.floor(step / 2))) {
      const idx = (y * width + x) * 4;
      const a = imgData[idx + 3];
      if (a < 125) continue; // Skip transparency

      const r = imgData[idx];
      const g = imgData[idx + 1];
      const b = imgData[idx + 2];
      const hex = rgbToHex(r, g, b);
      const hsl = hexToHsl(hex);

      pixels.push({
        r, g, b, hex, hsl,
        xPct: Math.round((x / width) * 100),
        yPct: Math.round((y / height) * 100)
      });
    }
  }

  if (pixels.length === 0) return [];

  // Filter pixels based on Adobe Color mood
  let filteredPixels = pixels;
  switch (mood) {
    case 'colorful':
      filteredPixels = pixels.filter(p => p.hsl.s >= 25 && p.hsl.l >= 15 && p.hsl.l <= 90);
      break;
    case 'bright':
      filteredPixels = pixels.filter(p => p.hsl.l >= 50 && p.hsl.s >= 30);
      break;
    case 'muted':
      filteredPixels = pixels.filter(p => p.hsl.s <= 45 && p.hsl.l >= 20 && p.hsl.l <= 80);
      break;
    case 'deep':
      filteredPixels = pixels.filter(p => p.hsl.l >= 20 && p.hsl.l <= 55);
      break;
    case 'dark':
      filteredPixels = pixels.filter(p => p.hsl.l <= 35);
      break;
    case 'none':
    default:
      filteredPixels = pixels;
      break;
  }

  if (filteredPixels.length < count) {
    filteredPixels = pixels; // Fallback to all pixels
  }

  // Sort by target mood score
  filteredPixels.sort((a, b) => {
    if (mood === 'bright') return b.hsl.l - a.hsl.l;
    if (mood === 'dark') return a.hsl.l - b.hsl.l;
    if (mood === 'deep') return b.hsl.s - a.hsl.s;
    if (mood === 'muted') return a.hsl.s - b.hsl.s;
    return b.hsl.s - a.hsl.s; // Default colorful saturation
  });

  // Pick N distinct spatial markers across image canvas
  const markers = [];
  for (const pixel of filteredPixels) {
    if (markers.length >= count) break;

    const isDistinct = markers.every(m => {
      const distH = Math.abs((m.hsl.h - pixel.hsl.h + 540) % 360 - 180);
      const distS = Math.abs(m.hsl.s - pixel.hsl.s);
      const distL = Math.abs(m.hsl.l - pixel.hsl.l);
      const distSpatial = Math.sqrt(Math.pow(m.xPct - pixel.xPct, 2) + Math.pow(m.yPct - pixel.yPct, 2));
      return (distH > 15 || distS > 20 || distL > 20) && distSpatial > 12;
    });

    if (isDistinct || markers.length === 0) {
      markers.push({
        id: markers.length,
        hex: pixel.hex,
        hsl: pixel.hsl,
        xPct: Math.min(92, Math.max(8, pixel.xPct)),
        yPct: Math.min(92, Math.max(8, pixel.yPct))
      });
    }
  }

  // Fallback if distinct markers under count
  let fillIdx = 0;
  while (markers.length < count && fillIdx < filteredPixels.length) {
    const pixel = filteredPixels[fillIdx++];
    if (!markers.some(m => m.hex === pixel.hex)) {
      markers.push({
        id: markers.length,
        hex: pixel.hex,
        hsl: pixel.hsl,
        xPct: Math.min(92, Math.max(8, pixel.xPct)),
        yPct: Math.min(92, Math.max(8, pixel.yPct))
      });
    }
  }

  return markers;
}

// Dynamic N-Swatch UI Role Mapping Engine for Palette Visualizer Arena
export function getPaletteRoleMapping(colors = [], isDark = true) {
  const swatches = colors.map(c => typeof c === 'string' ? c : c?.hex || '#6366f1');
  
  const primary = swatches[0] || '#6366f1';
  const secondary = swatches[1] || swatches[0] || '#3b82f6';
  const accent = swatches[2] || swatches[0] || '#10b981';
  const highlight = swatches[3] || swatches[1] || '#f59e0b';
  const warning = swatches[4] || swatches[2] || '#ef4444';

  const bgSurface = isDark ? '#0f172a' : '#ffffff';
  const bgCard = isDark ? '#1e293b' : '#f8fafc';
  const bgInput = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const primaryHsl = hexToHsl(primary);
  const textOnPrimary = primaryHsl.l > 60 ? '#0f172a' : '#ffffff';

  return {
    primary,
    secondary,
    accent,
    highlight,
    warning,
    swatches,
    bgSurface,
    bgCard,
    bgInput,
    textPrimary,
    textMuted,
    textOnPrimary,
    border
  };
}
