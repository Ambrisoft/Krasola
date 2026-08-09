// Isolated mathematical vector pattern formulas and encoders for Pattern Studio

export const PATTERN_TYPES = {
  dots: {
    name: 'Polka Dots',
    category: 'Minimalist',
    defaultBg: '#0f172a',
    defaultColor1: '#6366f1',
    defaultColor2: '#38bdf8',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <circle cx="${w/2}" cy="${h/2}" r="${(w/4) * scale}" fill="${color1}" />
      </pattern>
    `
  },
  grid: {
    name: 'Tech Grid Mesh',
    category: 'Geometric',
    defaultBg: '#020617',
    defaultColor1: '#3b82f6',
    defaultColor2: '#60a5fa',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M ${w} 0 L 0 0 0 ${h}" fill="none" stroke="${color1}" stroke-width="${stroke * scale}" />
      </pattern>
    `
  },
  stripes: {
    name: 'Diagonal Stripes',
    category: 'Minimalist',
    defaultBg: '#1e1b4b',
    defaultColor1: '#818cf8',
    defaultColor2: '#c084fc',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M 0 ${h} L ${w} 0 M -${w/4} ${h/4} L ${w/4} -${h/4} M ${3*w/4} ${5*h/4} L ${5*w/4} ${3*h/4}" stroke="${color1}" stroke-width="${stroke * scale * 2}" />
      </pattern>
    `
  },
  waves: {
    name: 'Sine Wave Ripples',
    category: 'Flow',
    defaultBg: '#042f2e',
    defaultColor1: '#14b8a6',
    defaultColor2: '#2dd4bf',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M 0 ${h/2} Q ${w/4} ${(h/2) - (h/4)*scale} ${w/2} ${h/2} T ${w} ${h/2}" fill="none" stroke="${color1}" stroke-width="${stroke}" />
      </pattern>
    `
  },
  hexagons: {
    name: 'Honeycomb Hex',
    category: 'Geometric',
    defaultBg: '#18181b',
    defaultColor1: '#f59e0b',
    defaultColor2: '#fbbf24',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M ${w/2} 0 L ${w} ${h/4} L ${w} ${3*h/4} L ${w/2} ${h} L 0 ${3*h/4} L 0 ${h/4} Z" fill="none" stroke="${color1}" stroke-width="${stroke * scale}" />
      </pattern>
    `
  },
  triangles: {
    name: 'Geometric Triangles',
    category: 'Geometric',
    defaultBg: '#31101e',
    defaultColor1: '#ec4899',
    defaultColor2: '#f472b6',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M ${w/2} 0 L ${w} ${h} L 0 ${h} Z" fill="${color1}" stroke="${color2}" stroke-width="${stroke}" />
      </pattern>
    `
  },
  crosses: {
    name: 'Plus Crosses',
    category: 'Minimalist',
    defaultBg: '#0f172a',
    defaultColor1: '#10b981',
    defaultColor2: '#34d399',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M ${w/2} ${h/4} L ${w/2} ${3*h/4} M ${w/4} ${h/2} L ${3*w/4} ${h/2}" fill="none" stroke="${color1}" stroke-width="${stroke * scale}" stroke-linecap="round" />
      </pattern>
    `
  },
  isometric: {
    name: '3D Cube Mesh',
    category: '3D',
    defaultBg: '#090d16',
    defaultColor1: '#6366f1',
    defaultColor2: '#a855f7',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M ${w/2} 0 L ${w} ${h/3} L ${w} ${2*h/3} L ${w/2} ${h} L 0 ${2*h/3} L 0 ${h/3} Z" fill="none" stroke="${color1}" stroke-width="${stroke * scale}" />
        <path d="M ${w/2} 0 L ${w/2} ${h} M 0 ${h/3} L ${w} ${2*h/3} M 0 ${2*h/3} L ${w} ${h/3}" stroke="${color2}" stroke-width="${stroke * 0.75}" />
      </pattern>
    `
  },
  chevrons: {
    name: 'ZigZag Chevron',
    category: 'Flow',
    defaultBg: '#1e293b',
    defaultColor1: '#0ea5e9',
    defaultColor2: '#38bdf8',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M 0 ${h/2} L ${w/2} ${h/4 * scale} L ${w} ${h/2} M 0 ${h} L ${w/2} ${h - (h/4)*scale} L ${w} ${h}" fill="none" stroke="${color1}" stroke-width="${stroke}" />
      </pattern>
    `
  },
  circles: {
    name: 'Concentric Radar',
    category: 'Flow',
    defaultBg: '#022c22',
    defaultColor1: '#10b981',
    defaultColor2: '#6ee7b7',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <circle cx="${w/2}" cy="${h/2}" r="${(w/2) * scale}" fill="none" stroke="${color1}" stroke-width="${stroke}" />
        <circle cx="${w/2}" cy="${h/2}" r="${(w/4) * scale}" fill="none" stroke="${color2}" stroke-width="${stroke}" />
      </pattern>
    `
  },
  diamonds: {
    name: 'Rhombus Mesh',
    category: 'Geometric',
    defaultBg: '#2e1065',
    defaultColor1: '#a855f7',
    defaultColor2: '#e879f9',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M ${w/2} 0 L ${w} ${h/2} L ${w/2} ${h} L 0 ${h/2} Z" fill="none" stroke="${color1}" stroke-width="${stroke}" />
      </pattern>
    `
  },
  circuit: {
    name: 'Cyber Circuit',
    category: 'Tech',
    defaultBg: '#090d16',
    defaultColor1: '#22c55e',
    defaultColor2: '#4ade80',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M 0 ${h/2} H ${w/2} V ${h} M ${w/2} 0 V ${h/2} H ${w}" fill="none" stroke="${color1}" stroke-width="${stroke}" />
        <circle cx="${w/2}" cy="${h/2}" r="${stroke * 2}" fill="${color2}" />
      </pattern>
    `
  },
  stars: {
    name: 'Constellations',
    category: 'Stellar',
    defaultBg: '#030712',
    defaultColor1: '#f59e0b',
    defaultColor2: '#fef08a',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M ${w/2} 0 L ${5*w/8} ${3*h/8} L ${w} ${h/2} L ${5*w/8} ${5*h/8} L ${w/2} ${h} L ${3*w/8} ${5*h/8} L 0 ${h/2} L ${3*w/8} ${3*h/8} Z" fill="${color1}" />
      </pattern>
    `
  },
  squiggles: {
    name: 'Memphis Waves',
    category: 'Abstract',
    defaultBg: '#172554',
    defaultColor1: '#3b82f6',
    defaultColor2: '#93c5fd',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M 0 ${h/3} C ${w/3} 0, ${2*w/3} ${h}, ${w} ${2*h/3}" fill="none" stroke="${color1}" stroke-width="${stroke * 1.5}" stroke-linecap="round" />
      </pattern>
    `
  },
  moroccan: {
    name: 'Moroccan Tile',
    category: 'Heritage',
    defaultBg: '#450a0a',
    defaultColor1: '#f43f5e',
    defaultColor2: '#fb7185',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M 0 0 Q ${w/2} ${h/2} ${w} 0 Q ${w/2} ${h/2} ${w} ${h} Q ${w/2} ${h/2} 0 ${h} Q ${w/2} ${h/2} 0 0 Z" fill="none" stroke="${color1}" stroke-width="${stroke}" />
      </pattern>
    `
  },
  bamboo: {
    name: 'Japanese Lattice',
    category: 'Weave',
    defaultBg: '#1c1917',
    defaultColor1: '#84cc16',
    defaultColor2: '#a3e635',
    svg: (w, h, scale, stroke, color1, color2, bg) => `
      <pattern id="pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill="${bg}" />
        <path d="M 0 0 L ${w} ${h} M ${w} 0 L 0 ${h}" stroke="${color1}" stroke-width="${stroke}" />
        <rect x="${w/4}" y="${h/4}" width="${w/2}" height="${h/2}" fill="none" stroke="${color2}" stroke-width="${stroke}" />
      </pattern>
    `
  }
};

// Generates complete repeated SVG code
export function generateFullSvg(innerPattern, angle) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    ${innerPattern.trim().replace('id="pattern"', `id="pattern" patternTransform="rotate(${angle})"`)}
  </defs>
  <rect width="100%" height="100%" fill="url(#pattern)" />
</svg>
  `.trim();
}

// URL Encodes SVG for CSS backgrounds
export function generateCSSCode(fullSvg) {
  const encoded = encodeURIComponent(fullSvg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `background-image: url("data:image/svg+xml;utf8,${encoded}");`;
}
