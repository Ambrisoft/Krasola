// Utility functions for smart deterministic asset naming & database uniqueness enforcement

// Helper to convert hex to RGB
function hexToRgb(hex) {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Helper to convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
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

// Analyze Palette Color Profile
function analyzeColorProfile(colors) {
  if (!colors || colors.length === 0) {
    return { hueCategory: 'Warm', toneCategory: 'Vivid' };
  }

  const hslList = colors.map(c => {
    const rgb = hexToRgb(c);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
  });

  const avgH = hslList.reduce((acc, c) => acc + c.h, 0) / hslList.length;
  const avgS = hslList.reduce((acc, c) => acc + c.s, 0) / hslList.length;
  const avgL = hslList.reduce((acc, c) => acc + c.l, 0) / hslList.length;

  // Classify Hue
  let hueCategory = 'Warm';
  if (avgH >= 345 || avgH < 25) hueCategory = 'Red';
  else if (avgH >= 25 && avgH < 50) hueCategory = 'Amber';
  else if (avgH >= 50 && avgH < 75) hueCategory = 'Yellow';
  else if (avgH >= 75 && avgH < 160) hueCategory = 'Green';
  else if (avgH >= 160 && avgH < 200) hueCategory = 'Cyan';
  else if (avgH >= 200 && avgH < 260) hueCategory = 'Blue';
  else if (avgH >= 260 && avgH < 315) hueCategory = 'Purple';
  else if (avgH >= 315 && avgH < 345) hueCategory = 'Pink';

  // Classify Tone / Saturation / Lightness
  let toneCategory = 'Balanced';
  if (avgS < 18 && avgL > 75) toneCategory = 'MonochromeLight';
  else if (avgS < 18 && avgL <= 30) toneCategory = 'MonochromeDark';
  else if (avgL > 75 && avgS < 60) toneCategory = 'Pastel';
  else if (avgL < 25) toneCategory = 'Dark';
  else if (avgS > 70 && avgL >= 40 && avgL <= 65) toneCategory = 'Vivid';
  else if (avgS > 75 && (avgL < 40 || avgL > 65)) toneCategory = 'Neon';

  return { avgH, avgS, avgL, hueCategory, toneCategory };
}

// Generate Palette Name from Visual Parameters
export function generateBasePaletteName(colors) {
  const { hueCategory, toneCategory } = analyzeColorProfile(colors);

  const adjectives = {
    Pastel: ['Soft', 'Gentle', 'Silk', 'Cloud', 'Quiet', 'Whisper'],
    Dark: ['Obsidian', 'Abyssal', 'Midnight', 'Shadow', 'Cosmic', 'Deep'],
    Vivid: ['Radiant', 'Electric', 'Vibrant', 'Dynamic', 'Luminous', 'Striked'],
    Neon: ['Cyber', 'Neon', 'Synth', 'Pulse', 'Laser', 'Hyper'],
    MonochromeLight: ['Pure', 'Minimal', 'Slate', 'Snow', 'Clean', 'Paper'],
    MonochromeDark: ['Charcoal', 'Graphite', 'Steel', 'Iron', 'Dark', 'Night'],
    Balanced: ['Harmonious', 'Balanced', 'Modern', 'Classic', 'Fluid', 'Elegance']
  };

  const nouns = {
    Red: ['Crimson', 'Ember', 'Coral', 'Ruby', 'Flame', 'Sunset'],
    Amber: ['Golden', 'Amber', 'Topaz', 'Honey', 'Harvest', 'Saffron'],
    Yellow: ['Citrus', 'Solar', 'Daylight', 'Topaz', 'Sunburst', 'Blaze'],
    Green: ['Emerald', 'Sage', 'Verdant', 'Forest', 'Moss', 'Jade'],
    Cyan: ['Glacier', 'Aqua', 'Turquoise', 'Breeze', 'Oceanic', 'Lagoon'],
    Blue: ['Sapphire', 'Cobalt', 'Azure', 'Cosmic', 'Horizon', 'Navy'],
    Purple: ['Amethyst', 'Orchid', 'Nebula', 'Velvet', 'Twilight', 'Violet'],
    Pink: ['Blossom', 'Quartz', 'Rose', 'Peony', 'Flamingo', 'Lotus']
  };

  const adjList = adjectives[toneCategory] || adjectives.Balanced;
  const nounList = nouns[hueCategory] || nouns.Red;

  // Pick deterministic indices based on color values to ensure consistent output for identical hex lists
  const seed = colors.reduce((acc, c) => acc + c.charCodeAt(c.length - 1), 0);
  const adj = adjList[seed % adjList.length];
  const noun = nounList[(seed * 3) % nounList.length];

  return `${adj} ${noun}`;
}

// Generate Pattern Name from Pattern Attributes
export function generateBasePatternName(patternType, settings, colors = []) {
  const typeMap = {
    dots: 'Polka Matrix',
    grid: 'Mesh Grid',
    waves: 'Sine Wave',
    cross: 'Lattice Cross',
    diagonal: 'Vector Stripe',
    lines: 'Linear Array',
    circles: 'Orbital Ring'
  };

  const scale = settings?.scale || 1;
  const stroke = settings?.stroke || 2;

  let densityPrefix = 'Standard';
  if (scale < 0.8 && stroke < 2) densityPrefix = 'Fine Micro';
  else if (scale < 0.8) densityPrefix = 'Dense Micro';
  else if (scale > 1.4 && stroke > 3) densityPrefix = 'Grand Heavy';
  else if (scale > 1.4) densityPrefix = 'Expanded';
  else if (stroke > 3) densityPrefix = 'Bold';
  else if (stroke <= 1) densityPrefix = 'Minimalist';

  const baseType = typeMap[patternType] || 'Graphic Pattern';
  
  let colorContext = '';
  if (colors && colors.length > 0) {
    const { hueCategory } = analyzeColorProfile(colors);
    colorContext = hueCategory;
  }

  return colorContext 
    ? `${densityPrefix} ${colorContext} ${baseType}`
    : `${densityPrefix} ${baseType}`;
}

// Roman Numeral Converter for Duplicate Names (2 -> II, 3 -> III, etc.)
function toRomanNum(num) {
  const lookup = { X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let roman = '';
  for (let i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

// Helper to check if name exists in database or local list
async function isNameTaken(name, existingNames = [], tableName = 'community_palettes', supabase = null) {
  // Check local names list first
  const existsLocally = existingNames.some(n => typeof n === 'string' && n.toLowerCase() === name.toLowerCase());
  if (existsLocally) return true;

  // Check database if configured
  if (supabase) {
    try {
      const { data } = await supabase
        .from(tableName)
        .select('name')
        .eq('name', name)
        .maybeSingle();
      if (data) return true;
    } catch (e) {
      // Ignore query errors
    }
  }

  return false;
}

// Get Guaranteed Unique Palette Name
export async function getUniquePaletteName(colors, existingNames = [], supabase = null) {
  const baseName = generateBasePaletteName(colors);
  let name = baseName;
  let counter = 2;

  while (await isNameTaken(name, existingNames, 'community_palettes', supabase)) {
    name = `${baseName} ${toRomanNum(counter)}`;
    counter++;
  }

  return name;
}

// Get Guaranteed Unique Pattern Name
export async function getUniquePatternName(patternType, settings, colors = [], existingNames = [], supabase = null) {
  const baseName = generateBasePatternName(patternType, settings, colors);
  let name = baseName;
  let counter = 2;

  while (await isNameTaken(name, existingNames, 'community_patterns', supabase)) {
    name = `${baseName} ${toRomanNum(counter)}`;
    counter++;
  }

  return name;
}
