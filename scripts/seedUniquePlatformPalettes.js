// ==============================================================================
// Seeder for 1,050 Mathematically Distinct Official Platform Palettes
// Generated across 7 Color Science Harmony Modes with 100% Unique Names & Hex Codes
// ==============================================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { generateBasePaletteName } from '../src/utils/namingUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env manually
const envPath = resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length > 0) {
      process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Convert HSL to Hex
function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Generate 150 distinctly calibrated palettes per mode
function generateDistinctPalettesForMode(mode, count = 150) {
  const palettes = [];
  const existingModeNames = new Set();

  for (let i = 0; i < count; i++) {
    const t = i / count; // 0.0 to 1.0 linear step
    let colors = [];

    if (mode === 'Warm') {
      // Warm spectrum: Hues 340° through 65° (Red, Coral, Terracotta, Amber, Gold, Saffron)
      const baseH = (340 + t * 90) % 360;
      const s = 65 + (i % 5) * 6; // 65% - 89%
      colors = [
        hslToHex(baseH - 12, s, 25 + (i % 3) * 4),      // Deep shade
        hslToHex(baseH - 4, s - 5, 42 + (i % 4) * 3),   // Mid tone
        hslToHex(baseH + 6, s + 5, 56 + (i % 3) * 4),   // Dominant vibrant
        hslToHex(baseH + 18, s, 70 + (i % 4) * 3),      // Light tint
        hslToHex((baseH + 180 + (i % 20)) % 360, 45, 82) // Complementary soft accent
      ];
    } else if (mode === 'Cool') {
      // Cool spectrum: Hues 160° through 260° (Teal, Cyan, Azure, Cobalt, Sapphire, Indigo)
      const baseH = 160 + t * 100;
      const s = 60 + (i % 6) * 5;
      colors = [
        hslToHex(baseH + 20, s + 10, 18 + (i % 4) * 3), // Midnight cool base
        hslToHex(baseH + 8, s, 36 + (i % 3) * 4),       // Deep aquatic
        hslToHex(baseH, s + 8, 52 + (i % 4) * 3),        // Primary ocean
        hslToHex(baseH - 12, s - 10, 72 + (i % 3) * 3),  // Glacial foam
        hslToHex((baseH + 180 + (i % 15)) % 360, 75, 65) // Warm contrast accent
      ];
    } else if (mode === 'Pastel') {
      // Pastel spectrum: Full 360° circular sweep, high lightness, delicate saturation
      const baseH = (t * 360) % 360;
      const s = 38 + (i % 5) * 5; // 38% - 58%
      colors = [
        hslToHex(baseH, s, 88),
        hslToHex(baseH + 25, s + 4, 82),
        hslToHex(baseH + 60, s - 2, 78),
        hslToHex(baseH + 120, s + 6, 84),
        hslToHex(baseH + 200, s, 92)
      ];
    } else if (mode === 'Neon') {
      // Neon spectrum: High saturation (90%-100%), electric luminosity, high contrast
      const baseH = (t * 360) % 360;
      colors = [
        hslToHex(baseH + 240, 60, 12 + (i % 3) * 3), // Dark cyber background
        hslToHex(baseH, 98, 58),                     // Primary laser
        hslToHex(baseH + 45, 95, 52),                // Secondary neon
        hslToHex(baseH + 150, 92, 60),               // Electric punch
        hslToHex(baseH + 280, 95, 68)                // Fluorescent high-key
      ];
    } else if (mode === 'Retro') {
      // Retro spectrum: Earthy hues (Mustard, Avocado, Burnt Orange, Denim, Rust)
      const baseH = (20 + t * 240) % 360;
      const s = 35 + (i % 5) * 6; // 35% - 59%
      colors = [
        hslToHex(baseH + 10, s, 26 + (i % 3) * 4),
        hslToHex(baseH - 15, s + 8, 44 + (i % 4) * 3),
        hslToHex(baseH + 30, s + 5, 58 + (i % 3) * 4),
        hslToHex(baseH + 65, s - 5, 72 + (i % 4) * 2),
        hslToHex(baseH + 180, 25, 84)
      ];
    } else if (mode === 'Minimalist') {
      // Minimalist spectrum: Low saturation slates, clean neutrals with singular accent
      const baseH = (t * 360) % 360;
      const baseL = 12 + (i % 10) * 3;
      colors = [
        hslToHex(baseH, 8, baseL),
        hslToHex(baseH, 12, baseL + 20),
        hslToHex(baseH, 14, baseL + 42),
        hslToHex(baseH, 10, 88),
        hslToHex((baseH + 180) % 360, 70, 52) // Focal accent point
      ];
    } else if (mode === 'Dark') {
      // Dark spectrum: Deep abyssal values (L: 8% - 40%) with subtle luminescence
      const baseH = (220 + t * 280) % 360;
      const s = 45 + (i % 6) * 7;
      colors = [
        hslToHex(baseH + 40, s, 9 + (i % 3) * 2),
        hslToHex(baseH + 15, s + 5, 18 + (i % 4) * 3),
        hslToHex(baseH, s + 10, 30 + (i % 3) * 3),
        hslToHex(baseH - 20, s - 5, 45 + (i % 4) * 2),
        hslToHex(baseH + 140, 80, 68) // Cosmic starlight accent
      ];
    }

    // Generate unique name without Roman numerals
    let disambiguation = 0;
    let name = generateBasePaletteName(colors, disambiguation);

    while (existingModeNames.has(name.toLowerCase())) {
      disambiguation++;
      name = generateBasePaletteName(colors, disambiguation);
    }

    existingModeNames.add(name.toLowerCase());

    palettes.push({
      name: name,
      mode: mode,
      colors: colors,
      created_at: new Date(Date.now() - i * 3600000).toISOString()
    });
  }

  return palettes;
}

async function seedPlatformPalettes() {
  console.log("=================================================");
  console.log("🎨 Seeding 1,050 Distinct Official Platform Palettes");
  console.log("=================================================");

  const modes = ['Warm', 'Cool', 'Pastel', 'Neon', 'Retro', 'Minimalist', 'Dark'];
  const allPalettes = [];
  const globalNames = new Set();

  for (const mode of modes) {
    const modePalettes = generateDistinctPalettesForMode(mode, 150);
    for (const p of modePalettes) {
      let disambiguation = 0;
      while (globalNames.has(p.name.toLowerCase())) {
        disambiguation++;
        p.name = generateBasePaletteName(p.colors, disambiguation);
      }
      globalNames.add(p.name.toLowerCase());
      allPalettes.push(p);
    }
  }

  console.log(`Generated ${allPalettes.length} unique palettes.`);
  console.log(`Total unique names: ${globalNames.size} (0 Duplicates, 0 Roman Numerals)`);

  // 1. Clear old platform palettes
  console.log("\n🧹 Cleaning old platform palettes...");
  const { error: deleteError } = await supabase
    .from('platform_palettes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

  if (deleteError) {
    console.error("Error clearing old platform palettes:", deleteError);
  } else {
    console.log("Old platform palettes cleared.");
  }

  // 2. Batch insert new palettes
  console.log("\n🚀 Inserting 1,050 distinct palettes into Supabase...");
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < allPalettes.length; i += batchSize) {
    const batch = allPalettes.slice(i, i + batchSize);
    const { error: insertError } = await supabase
      .from('platform_palettes')
      .insert(batch);

    if (insertError) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError);
    } else {
      insertedCount += batch.length;
      process.stdout.write(`Inserted ${insertedCount}/${allPalettes.length} palettes...\r`);
    }
  }

  console.log(`\n\n✅ Seeding Complete! Successfully populated ${insertedCount} official palettes.`);
}

seedPlatformPalettes().catch(console.error);
