import { createClient } from '@supabase/supabase-js';
import { generateBasePaletteName } from '../src/utils/namingUtils.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://defxhgoqjfwlflpximes.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZnhoZ29xamZ3bGZscHhpbWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MjM0NjgsImV4cCI6MjEwMTk5OTQ2OH0.NNCgz0fQforZ5Bg-38MgTMnTp6oTIKBzMlsrinVgTSg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function toRoman(num) {
  const map = {
    M: 1000, CM: 900, D: 500, CD: 400,
    C: 100, XC: 90, L: 50, XL: 40,
    X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let result = '';
  for (let key in map) {
    while (num >= map[key]) {
      result += key;
      num -= map[key];
    }
  }
  return result;
}

const MODES = ['Warm', 'Cool', 'Pastel', 'Neon', 'Retro', 'Minimalist', 'Dark'];

function generatePalette(index) {
  const modeIndex = index % MODES.length;
  const mode = MODES[modeIndex];
  const baseH = Math.floor((index * 137.508) % 360);
  let colors = [];

  switch (mode) {
    case 'Warm': {
      const warmH = (baseH % 70 + 330) % 360;
      colors = [
        hslToHex(warmH, 65 + (index % 25), 18 + (index % 15)),
        hslToHex((warmH + 15) % 360, 75, 45),
        hslToHex((warmH + 30) % 360, 85, 55),
        hslToHex((warmH + 45) % 360, 90, 68),
        hslToHex((warmH + 60) % 360, 95, 82)
      ];
      break;
    }
    case 'Cool': {
      const coolH = (160 + (baseH % 110)) % 360;
      colors = [
        hslToHex(coolH, 70, 15 + (index % 15)),
        hslToHex((coolH + 20) % 360, 65, 38),
        hslToHex((coolH + 40) % 360, 75, 52),
        hslToHex((coolH + 60) % 360, 80, 68),
        hslToHex((coolH + 80) % 360, 85, 85)
      ];
      break;
    }
    case 'Pastel': {
      colors = [
        hslToHex(baseH, 45, 75),
        hslToHex((baseH + 40) % 360, 50, 80),
        hslToHex((baseH + 80) % 360, 40, 85),
        hslToHex((baseH + 120) % 360, 48, 88),
        hslToHex((baseH + 160) % 360, 55, 92)
      ];
      break;
    }
    case 'Neon': {
      colors = [
        hslToHex(baseH, 95, 12),
        hslToHex((baseH + 60) % 360, 100, 50),
        hslToHex((baseH + 120) % 360, 95, 55),
        hslToHex((baseH + 180) % 360, 100, 60),
        hslToHex((baseH + 240) % 360, 90, 75)
      ];
      break;
    }
    case 'Retro': {
      const retroH = (baseH + 25) % 360;
      colors = [
        hslToHex(retroH, 40, 25),
        hslToHex((retroH + 45) % 360, 45, 40),
        hslToHex((retroH + 90) % 360, 50, 55),
        hslToHex((retroH + 135) % 360, 55, 70),
        hslToHex((retroH + 180) % 360, 35, 82)
      ];
      break;
    }
    case 'Minimalist': {
      colors = [
        hslToHex(baseH, 12, 15),
        hslToHex(baseH, 14, 30),
        hslToHex(baseH, 16, 50),
        hslToHex(baseH, 18, 75),
        hslToHex(baseH, 10, 94)
      ];
      break;
    }
    case 'Dark': {
      colors = [
        hslToHex(baseH, 80, 8),
        hslToHex((baseH + 30) % 360, 70, 18),
        hslToHex((baseH + 60) % 360, 65, 28),
        hslToHex((baseH + 90) % 360, 60, 38),
        hslToHex((baseH + 120) % 360, 55, 50)
      ];
      break;
    }
  }

  return { colors, mode };
}

async function run() {
  console.log("🚀 Starting Official Platform Palettes Generator (Target: 1,050 presets)...");

  // Fetch existing names in platform_palettes to avoid any duplication
  const { data: existing } = await supabase.from('platform_palettes').select('name');
  const usedNames = new Set((existing || []).map(e => e.name));
  const nameCounterMap = {};

  // Track counts per base name
  usedNames.forEach(n => {
    const match = n.match(/^(.*?)(?:\s+([IVXLCDM]+))?$/);
    if (match) {
      const base = match[1].trim();
      nameCounterMap[base] = (nameCounterMap[base] || 0) + 1;
    }
  });

  const TOTAL_TARGET = 1050; // 1,050 official presets (fits +15% of 1000)
  const records = [];

  for (let i = 0; i < TOTAL_TARGET; i++) {
    const { colors, mode } = generatePalette(i);
    const baseName = generateBasePaletteName(colors);

    let finalName = baseName;
    if (usedNames.has(finalName)) {
      nameCounterMap[baseName] = (nameCounterMap[baseName] || 1) + 1;
      finalName = `${baseName} ${toRoman(nameCounterMap[baseName])}`;
      while (usedNames.has(finalName)) {
        nameCounterMap[baseName]++;
        finalName = `${baseName} ${toRoman(nameCounterMap[baseName])}`;
      }
    } else {
      nameCounterMap[baseName] = 1;
    }
    usedNames.add(finalName);

    records.push({
      name: finalName,
      colors: colors,
      mode: mode,
      created_at: new Date(Date.now() - (TOTAL_TARGET - i) * 60000).toISOString()
    });
  }

  console.log(`✨ Generated ${records.length} unique platform palette configurations.`);
  console.log("📦 Inserting records in batches of 100 into public.platform_palettes...");

  // Clear existing baseline presets or insert fresh
  // Batch insert
  const BATCH_SIZE = 100;
  let insertedCount = 0;

  for (let b = 0; b < records.length; b += BATCH_SIZE) {
    const chunk = records.slice(b, b + BATCH_SIZE);
    const { data, error } = await supabase.from('platform_palettes').insert(chunk).select();
    if (error) {
      console.error(`❌ Batch insert failed at index ${b}:`, error);
    } else {
      insertedCount += data.length;
      console.log(`✅ Progress: ${insertedCount}/${records.length} official platform palettes inserted.`);
    }
  }

  console.log(`🎉 SUCCESS! Completed inserting ${insertedCount} official platform palette presets into Supabase.`);
}

run().catch(err => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
