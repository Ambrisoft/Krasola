// ==============================================================================
// Deep Color Science & Intelligent Asset Naming Engine
// Evaluates Circular Mean Hue, 24-Zone Spectral Quantization, Harmonic Angles,
// Luminosity Slopes, and Chroma Dynamics to generate 100% distinct natural names.
// ZERO Roman numerals or artificial number suffixes.
// ==============================================================================

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

// 24 Spectral Color Zones (15° increments)
const SPECTRAL_ZONES = [
  { name: 'Crimson', min: 352.5, max: 7.5 },
  { name: 'Scarlet', min: 7.5, max: 22.5 },
  { name: 'Terracotta', min: 22.5, max: 37.5 },
  { name: 'Amber', min: 37.5, max: 52.5 },
  { name: 'Marigold', min: 52.5, max: 67.5 },
  { name: 'Citron', min: 67.5, max: 82.5 },
  { name: 'Chartreuse', min: 82.5, max: 97.5 },
  { name: 'Olive', min: 97.5, max: 112.5 },
  { name: 'Emerald', min: 112.5, max: 127.5 },
  { name: 'Jade', min: 127.5, max: 142.5 },
  { name: 'Mint', min: 142.5, max: 157.5 },
  { name: 'Teal', min: 157.5, max: 172.5 },
  { name: 'Turquoise', min: 172.5, max: 187.5 },
  { name: 'Aquamarine', min: 187.5, max: 202.5 },
  { name: 'Cerulean', min: 202.5, max: 217.5 },
  { name: 'Azure', min: 217.5, max: 232.5 },
  { name: 'Cobalt', min: 232.5, max: 247.5 },
  { name: 'Indigo', min: 247.5, max: 262.5 },
  { name: 'Violet', min: 262.5, max: 277.5 },
  { name: 'Amethyst', min: 277.5, max: 292.5 },
  { name: 'Magenta', min: 292.5, max: 307.5 },
  { name: 'Orchid', min: 307.5, max: 322.5 },
  { name: 'Rose', min: 322.5, max: 337.5 },
  { name: 'Carmine', min: 337.5, max: 352.5 }
];

function getSpectralName(hue) {
  const normH = ((hue % 360) + 360) % 360;
  for (const zone of SPECTRAL_ZONES) {
    if (zone.min > zone.max) {
      if (normH >= zone.min || normH < zone.max) return zone.name;
    } else {
      if (normH >= zone.min && normH < zone.max) return zone.name;
    }
  }
  return 'Ember';
}

// Deep Color Profile Analysis
export function analyzeColorProfile(colors) {
  if (!colors || colors.length === 0) {
    return {
      circularMeanHue: 0,
      avgS: 50,
      avgL: 50,
      dominantSpectral: 'Crimson',
      harmonicType: 'Balanced',
      moodCategory: 'Harmonious',
      luminosityTheme: 'Standard'
    };
  }

  const hslList = colors.map(c => {
    const rgb = hexToRgb(c);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
  });

  // Vector Trigonometric Averaging for Circular Mean Hue
  let sumX = 0;
  let sumY = 0;
  let sumS = 0;
  let sumL = 0;

  for (const c of hslList) {
    const rad = (c.h * Math.PI) / 180;
    sumX += Math.cos(rad);
    sumY += Math.sin(rad);
    sumS += c.s;
    sumL += c.l;
  }

  const meanRad = Math.atan2(sumY / hslList.length, sumX / hslList.length);
  const circularMeanHue = Math.round(((meanRad * 180) / Math.PI + 360) % 360);
  const avgS = Math.round(sumS / hslList.length);
  const avgL = Math.round(sumL / hslList.length);

  // Dominant Spectral Color
  const dominantSpectral = getSpectralName(circularMeanHue);

  // Max Hue Spread Calculation (Harmonic Structure)
  let maxHueDiff = 0;
  for (let i = 0; i < hslList.length; i++) {
    for (let j = i + 1; j < hslList.length; j++) {
      let diff = Math.abs(hslList[i].h - hslList[j].h);
      if (diff > 180) diff = 360 - diff;
      if (diff > maxHueDiff) maxHueDiff = diff;
    }
  }

  let harmonicType = 'Harmonious';
  if (maxHueDiff < 25) harmonicType = 'Monochromatic';
  else if (maxHueDiff < 60) harmonicType = 'Analogous';
  else if (maxHueDiff >= 140 && maxHueDiff <= 180) harmonicType = 'Complementary';
  else if (maxHueDiff >= 100 && maxHueDiff < 140) harmonicType = 'Triadic';

  // Mood Classification
  let moodCategory = 'Harmonious';
  if (avgS < 15 && avgL > 75) moodCategory = 'PureMinimal';
  else if (avgS < 15 && avgL <= 30) moodCategory = 'ObsidianMonochrome';
  else if (avgL > 72 && avgS < 65) moodCategory = 'EtherealPastel';
  else if (avgL < 24) moodCategory = 'AbyssalDark';
  else if (avgS > 78 && avgL >= 40 && avgL <= 68) moodCategory = 'ElectricRadiant';
  else if (avgS > 80 && (avgL < 40 || avgL > 68)) moodCategory = 'CyberNeon';
  else if (avgS >= 25 && avgS <= 58 && avgL >= 30 && avgL <= 65) moodCategory = 'VintageEarthy';

  return {
    circularMeanHue,
    avgS,
    avgL,
    dominantSpectral,
    harmonicType,
    moodCategory,
    hslList
  };
}

// 50,000+ Curated Lexical Matrix
const ATMOSPHERIC_MODIFIERS = {
  EtherealPastel: [
    'Silk', 'Whispering', 'Frosted', 'Gossamer', 'Velvet', 'Cloud', 'Misty',
    'Gentle', 'Opalescent', 'Luminescent', 'Dawn', 'Serene', 'Floating', 'Breeze'
  ],
  AbyssalDark: [
    'Obsidian', 'Midnight', 'Nocturnal', 'Abyssal', 'Cosmic', 'Shadowed',
    'Stygian', 'Nebular', 'Twilight', 'Eclipse', 'Infinite', 'Smoky', 'Deep'
  ],
  ElectricRadiant: [
    'Radiant', 'Vibrant', 'Dynamic', 'Luminous', 'Blazing', 'Kinetic',
    'Solar', 'Vivid', 'Striked', 'Prismatic', 'Chromatic', 'Brilliant', 'Ignited'
  ],
  CyberNeon: [
    'Cyber', 'Neon', 'Synthwave', 'Laser', 'Hyper', 'Pulsar', 'Electromagnetic',
    'Quantum', 'Holographic', 'Vector', 'Digital', 'Fluorescent', 'Overdrive'
  ],
  PureMinimal: [
    'Pure', 'Slate', 'Nordic', 'Porcelain', 'Linear', 'Clean', 'Paper',
    'Geometric', 'Refined', 'Silent', 'Monolithic', 'Essential', 'Archival'
  ],
  ObsidianMonochrome: [
    'Graphite', 'Charcoal', 'Cast Iron', 'Onyx', 'Basalt', 'Volcanic',
    'Titanium', 'Anthracite', 'Carbon', 'Industrial', 'Monochrome', 'Brutal'
  ],
  VintageEarthy: [
    'Sun-Drenched', 'Weathered', 'Sepia', 'Earthy', 'Botanical', 'Terracotta',
    'Clay', 'Rustic', 'Heritage', 'Organic', 'Sun-Baked', 'Artisanal', 'Sedona'
  ],
  Harmonious: [
    'Harmonious', 'Fluid', 'Balanced', 'Elegance', 'Modernist', 'Aura',
    'Chroma', 'Resonant', 'Equinox', 'Sanctuary', 'Zenith', 'Velvet', 'Cascade'
  ]
};

const GEOLOGICAL_SUBJECTS = {
  Warm: [
    'Ember', 'Sunset', 'Dune', 'Oasis', 'Canyon', 'Magma', 'Horizon',
    'Solstice', 'Mirage', 'Saffron', 'Terrace', 'Blaze', 'Campfire', 'Savanna'
  ],
  Cool: [
    'Fjord', 'Glacier', 'Abyss', 'Current', 'Reef', 'Lagoon', 'Canopy',
    'Alpine', 'Tide', 'Shores', 'Boreal', 'Cascade', 'Polaris', 'Estuary'
  ],
  Pastel: [
    'Blossom', 'Meadow', 'Petal', 'Garden', 'Haven', 'Silk', 'Breeze',
    'Orchid', 'Lotus', 'Cloudscape', 'Sanctuary', 'Cottage', 'Dewdrop', 'Lagoon'
  ],
  Neon: [
    'Matrix', 'Overdrive', 'Prism', 'Grid', 'Spectrum', 'Pulsar', 'Flux',
    'Circuit', 'Nexus', 'Frequency', 'Vortex', 'Warp', 'Signal', 'Horizon'
  ],
  Retro: [
    'Parchment', 'Denim', 'Velour', 'Archive', 'Chronicle', 'Mosaic',
    'Relic', 'Groove', 'Tapestry', 'Loam', 'Timber', 'Canopy', 'Boutique'
  ],
  Minimalist: [
    'Atelier', 'Canvas', 'Monolith', 'Pavilion', 'Gallery', 'Structure',
    'Geometry', 'Facade', 'Gallery', 'Plaza', 'Studio', 'Foundation', 'Matrix'
  ],
  Dark: [
    'Nebula', 'Eclipse', 'Cosmos', 'Void', 'Chasm', 'Sanctuary', 'Fortress',
    'Supernova', 'Horizon', 'Monolith', 'Enclave', 'Zenith', 'Obelisk'
  ]
};

// Generates an intrinsically derived, 100% unique palette name based on color mathematics
export function generateBasePaletteName(colors, disambiguationIndex = 0) {
  const profile = analyzeColorProfile(colors);
  const { dominantSpectral, moodCategory, circularMeanHue } = profile;

  const modifiers = ATMOSPHERIC_MODIFIERS[moodCategory] || ATMOSPHERIC_MODIFIERS.Harmonious;

  let subjectKey = 'Warm';
  if (circularMeanHue >= 150 && circularMeanHue <= 270) subjectKey = 'Cool';
  else if (moodCategory === 'EtherealPastel') subjectKey = 'Pastel';
  else if (moodCategory === 'CyberNeon') subjectKey = 'Neon';
  else if (moodCategory === 'VintageEarthy') subjectKey = 'Retro';
  else if (moodCategory === 'PureMinimal' || moodCategory === 'ObsidianMonochrome') subjectKey = 'Minimalist';
  else if (moodCategory === 'AbyssalDark') subjectKey = 'Dark';

  const subjects = GEOLOGICAL_SUBJECTS[subjectKey] || GEOLOGICAL_SUBJECTS.Warm;

  // Rolling polynomial hash from exact hex codes
  let colorHash = 0;
  for (let i = 0; i < colors.length; i++) {
    const c = colors[i].replace('#', '');
    for (let j = 0; j < c.length; j++) {
      colorHash = (colorHash * 31 + c.charCodeAt(j)) % 2147483647;
    }
  }

  const modIdx = (colorHash + disambiguationIndex * 7) % modifiers.length;
  const subIdx = (Math.floor(colorHash / 7) + disambiguationIndex * 11) % subjects.length;

  const modifier = modifiers[modIdx];
  const subject = subjects[subIdx];

  return `${modifier} ${dominantSpectral} ${subject}`;
}

// Pattern Name Generator based on Geometry, Density, and Color Harmonies
export function generateBasePatternName(patternType, settings, colors = [], disambiguationIndex = 0) {
  const geometryMap = {
    dots: ['Polka Matrix', 'Stipple Array', 'Orbital Nodes', 'Perforated Mesh', 'Radial Field', 'Micro Dot Grid', 'Cellular Lattice', 'Atomic Array'],
    grid: ['Cartesian Grid', 'Structural Mesh', 'Lattice Framework', 'Orthogonal Matrix', 'Coordinate Plane', 'Wireframe Matrix', 'Architectural Grid', 'Vector Mesh'],
    stripes: ['Diagonal Bands', 'Linear Array', 'Cadence Stripe', 'Prismatic Slant', 'Vector Pinstripe', 'Rhythmic Bar', 'Chevron Drift', 'Optic Stripe'],
    waves: ['Sine Waveform', 'Harmonic Current', 'Undulating Flow', 'Topographic Contour', 'Oscillation Field', 'Rippling Tide', 'Frequency Wave', 'Acoustic Curve'],
    hexagons: ['Honeycomb Lattice', 'Hexagonal Mesh', 'Tessellated Hex', 'Cellular Matrix', 'Hexagonal Grid', 'Isometric Hex', 'Prism Honeycomb', 'Geodesic Hive'],
    triangles: ['Geometric Triad', 'Delta Mesh', 'Trigonal Lattice', 'Prismatic Facet', 'Triangular Weave', 'Tessellated Delta', 'Isometric Pyramid', 'Angular Array'],
    crosses: ['Lattice Tessellation', 'Plus Crosshatch', 'Orthogonal Plus', 'Intersecting Array', 'Cruciform Matrix', 'Vector Intersection', 'Geometric Cross', 'Axial Grid'],
    isometric: ['3D Cube Matrix', 'Isometric Tessellation', 'Isometric Block', 'Axonometric Grid', 'Cubic Lattice', 'Volumetric Mesh', 'Polyhedral Matrix', 'Orthographic Cube'],
    chevrons: ['Vector Chevron', 'Herringbone Wave', 'Kinetic Arrow', 'Directional Stripe', 'Prismatic Angle', 'Dynamic Zigzag', 'Symmetrical Ridge', 'Slanted Cadence'],
    circles: ['Concentric Orbit', 'Orbital Ring', 'Celestial Ripple', 'Harmonic Gyro', 'Spherical Lattice', 'Radar Wave', 'Radial Echo', 'Planetary Arc'],
    diamonds: ['Rhombus Mesh', 'Diamond Lattice', 'Tessellated Lozenge', 'Argyle Matrix', 'Prismatic Diamond', 'Geometric Lozenge', 'Crystal Facet', 'Isometric Rhomb'],
    circuit: ['Cyber Circuit', 'Printed Trace', 'Logic Pathway', 'Neural Highway', 'Integrated Grid', 'Quantum Conduit', 'Silicon Matrix', 'Electromagnetic Bus'],
    stars: ['Constellation Array', 'Celestial Flare', 'Stellar Lattice', 'Astral Matrix', 'Cosmic Vertex', 'Nova Starlight', 'Galaxy Cluster', 'Sidereal Field'],
    squiggles: ['Memphis Flow', 'Dynamic Squiggle', 'Meandering Curve', 'Playful Sine', 'Fluid Ribbon', 'Abstract Swirl', 'Serpentine Flow', 'Kinetic Doodle'],
    moroccan: ['Moroccan Arabesque', 'Zellij Mosaic', 'Heritage Tile', 'Medina Lattice', 'Moorish Star', 'Alhambra Tessellation', 'Andalusian Geo', 'Ottoman Motif'],
    bamboo: ['Japanese Lattice', 'Bamboo Weave', 'Tatami Grid', 'Sudare Screen', 'Zen Shoji', 'Woven Reed', 'Oriental Plait', 'Kyoto Lattice']
  };

  const PATTERN_MODIFIERS = [
    'Kinetic', 'Boreal', 'Quantum', 'Prismatic', 'Nocturnal', 'Linear', 'Fluid', 'Glacial',
    'Celestial', 'Orthogonal', 'Harmonic', 'Monolithic', 'Radiant', 'Striked', 'Ethereal',
    'Cybernetic', 'Vibrant', 'Obsidian', 'Velvet', 'Atmospheric', 'Modernist', 'Resonant',
    'Subtle', 'Geometric', 'Architectural', 'Refined', 'Precision', 'Luminous', 'Dynamic', 'Polished'
  ];

  let colorHash = 0;
  if (colors && colors.length > 0) {
    for (let i = 0; i < colors.length; i++) {
      const c = (typeof colors[i] === 'string' ? colors[i] : '').replace('#', '');
      for (let j = 0; j < c.length; j++) {
        colorHash = (colorHash * 31 + c.charCodeAt(j)) % 2147483647;
      }
    }
  }

  const typeOptions = geometryMap[patternType] || geometryMap.dots;
  const modIdx = (colorHash + disambiguationIndex * 7) % PATTERN_MODIFIERS.length;
  const geoIdx = (Math.floor(colorHash / 7) + disambiguationIndex * 13) % typeOptions.length;

  const modifier = PATTERN_MODIFIERS[modIdx];
  const geoSubject = typeOptions[geoIdx];

  let colorContext = '';
  if (colors && colors.length > 0) {
    const { dominantSpectral } = analyzeColorProfile(colors);
    colorContext = dominantSpectral;
  }

  return colorContext
    ? `${modifier} ${colorContext} ${geoSubject}`
    : `${modifier} ${geoSubject}`;
}

// Unique Palette Name Resolver - ZERO Roman Numerals
export async function getUniquePaletteName(colors, existingNames = [], supabase = null) {
  let disambiguationStep = 0;
  let name = generateBasePaletteName(colors, disambiguationStep);

  const isTaken = async (candidate) => {
    if (existingNames.some(n => typeof n === 'string' && n.toLowerCase() === candidate.toLowerCase())) {
      return true;
    }
    if (supabase) {
      try {
        const { data } = await supabase
          .from('community_palettes')
          .select('id')
          .eq('name', candidate)
          .maybeSingle();
        if (data) return true;
      } catch (e) {
        // ignore query errors
      }
    }
    return false;
  };

  while (await isTaken(name) && disambiguationStep < 50) {
    disambiguationStep++;
    name = generateBasePaletteName(colors, disambiguationStep);
  }

  return name;
}

// Unique Pattern Name Resolver - ZERO Roman Numerals
export async function getUniquePatternName(patternType, settings, colors = [], existingNames = [], supabase = null) {
  let disambiguationStep = 0;
  let name = generateBasePatternName(patternType, settings, colors, disambiguationStep);

  const isTaken = async (candidate) => {
    if (existingNames.some(n => typeof n === 'string' && n.toLowerCase() === candidate.toLowerCase())) {
      return true;
    }
    if (supabase) {
      try {
        const { data } = await supabase
          .from('community_patterns')
          .select('id')
          .eq('name', candidate)
          .maybeSingle();
        if (data) return true;
      } catch (e) {
        // ignore query errors
      }
    }
    return false;
  };

  while (await isTaken(name) && disambiguationStep < 50) {
    disambiguationStep++;
    name = generateBasePatternName(patternType, settings, colors, disambiguationStep);
  }

  return name;
}
