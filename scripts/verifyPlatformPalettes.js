import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function verify() {
  const { data, count, error } = await supabase
    .from('platform_palettes')
    .select('name, mode', { count: 'exact' });

  if (error) {
    console.error("Query error:", error);
    return;
  }

  console.log(`Total platform palettes in database: ${data.length}`);

  // Check for duplicates
  const nameCounts = {};
  data.forEach(p => {
    nameCounts[p.name] = (nameCounts[p.name] || 0) + 1;
  });

  const duplicates = Object.entries(nameCounts).filter(([name, c]) => c > 1);
  console.log(`Duplicate names found: ${duplicates.length}`);

  // Check for Roman numerals
  const romanPattern = /\b(II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX)\b$/;
  const withRoman = data.filter(p => romanPattern.test(p.name));
  console.log(`Palettes with Roman numerals: ${withRoman.length}`);

  console.log("\nSample 10 Platform Palette Names:");
  data.slice(0, 10).forEach((p, idx) => console.log(`  ${idx + 1}. [${p.mode}] ${p.name}`));
}

verify();
