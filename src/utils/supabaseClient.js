import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== '';

export const supabase = isSupabaseConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// Mock databases stored in localStorage for fallback/local simulated operations
const getMockTable = (key) => JSON.parse(localStorage.getItem(`mock_db_${key}`) || '[]');
const saveMockTable = (key, data) => localStorage.setItem(`mock_db_${key}`, JSON.stringify(data));

// Baseline mock templates for Palette Lab
const fallbackPresetsPalettes = [
  { id: 'p1', name: 'Snowy Light', colors: ['#0f172a', '#1e293b', '#3b82f6', '#10b981', '#f59e0b'], mode: 'Analogous' },
  { id: 'p2', name: 'Neon Coral', colors: ['#1e1b4b', '#4c1d95', '#ec4899', '#f43f5e', '#fb7185'], mode: 'Complementary' },
  { id: 'p3', name: 'Forest Moss', colors: ['#064e3b', '#047857', '#10b981', '#34d399', '#6ee7b7'], mode: 'Monochromatic' }
];

// Baseline mock templates for Pattern Studio
const fallbackPresetsPatterns = [
  { id: 't1', key: 'dots', name: 'Polka Dots', category: 'Minimalist', defaultBg: '#0f172a', defaultColor1: '#6366f1', defaultColor2: '#38bdf8' },
  { id: 't2', key: 'grid', name: 'Tech Grid Mesh', category: 'Geometric', defaultBg: '#020617', defaultColor1: '#3b82f6', defaultColor2: '#60a5fa' },
  { id: 't3', key: 'waves', name: 'Sine Wave Ripples', category: 'Flow', defaultBg: '#042f2e', defaultColor1: '#14b8a6', defaultColor2: '#2dd4bf' }
];

export async function fetchPlatformPalettes() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('platform_palettes')
        .select('*')
        .range(0, 2000)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase fetch failed, loading presets fallback.", e);
    }
  }
  return fallbackPresetsPalettes;
}

export async function fetchCommunityPalettes() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('community_palettes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase fetch failed, loading community fallback.", e);
    }
  }
  return getMockTable('community_palettes').filter(p => p.is_public === true);
}

export async function saveCommunityPalette({ name, colors, mode, username = 'Anonymous Designer' }) {
  const newPalette = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    name,
    colors,
    mode,
    username,
    likes: 0,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const insertData = { ...newPalette };
      if (session?.user) {
        insertData.user_id = session.user.id;
      }
      const { data, error } = await supabase.from('community_palettes').insert([insertData]).select();
      if (!error && data) return data[0];
    } catch (e) {
      console.warn("Supabase save failed, saving locally.", e);
    }
  }

  const list = getMockTable('community_palettes');
  list.unshift(newPalette);
  saveMockTable('community_palettes', list);
  return newPalette;
}

export async function fetchPlatformPatterns() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('platform_patterns').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase fetch failed, loading presets fallback.", e);
    }
  }
  return fallbackPresetsPatterns;
}

export async function fetchCommunityPatterns() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('community_patterns')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase fetch failed, loading community fallback.", e);
    }
  }
  return getMockTable('community_patterns').filter(p => p.is_public === true);
}

export async function saveCommunityPattern({ name, patternType, settings, username = 'Anonymous Maker' }) {
  const newPattern = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    name,
    pattern_type: patternType,
    width: settings.width,
    height: settings.height,
    scale: settings.scale,
    stroke: settings.stroke,
    angle: settings.angle,
    bg: settings.bg,
    color1: settings.color1,
    color2: settings.color2,
    username,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const insertData = { ...newPattern };
      if (session?.user) {
        insertData.user_id = session.user.id;
      }
      const { data, error } = await supabase.from('community_patterns').insert([insertData]).select();
      if (!error && data) return data[0];
    } catch (e) {
      console.warn("Supabase save failed, saving locally.", e);
    }
  }

  const list = getMockTable('community_patterns');
  list.unshift(newPattern);
  saveMockTable('community_patterns', list);
  return newPattern;
}

/**
 * Image Storage & Metadata Operations
 */

export async function uploadUserImage(imageBlob, { title, creator = 'Krasola Studio', width = 1920, height = 1080, isPublic = false }, user) {
  if (!isSupabaseConfigured || !user) {
    throw new Error("Supabase is not configured or user is unauthenticated.");
  }

  const imageId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
  const storagePath = `vault/${user.id}/${imageId}.webp`;

  // 1. Upload binary WebP Blob to Supabase Storage bucket 'krasola-images'
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('krasola-images')
    .upload(storagePath, imageBlob, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // 2. Retrieve public URL
  const { data: { publicUrl } } = supabase.storage
    .from('krasola-images')
    .getPublicUrl(storagePath);

  const username = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Anonymous';

  // 3. Insert metadata record into PostgreSQL public.user_images (triggers quota enforcement)
  const { data: record, error: metaError } = await supabase
    .from('user_images')
    .insert([{
      id: imageId,
      user_id: user.id,
      username: username,
      title: title || 'Untitled Artwork',
      creator: creator,
      storage_path: storagePath,
      public_url: publicUrl,
      width: width,
      height: height,
      file_size_bytes: imageBlob.size,
      is_public: isPublic,
      likes: 0
    }])
    .select()
    .single();

  if (metaError) {
    // If metadata insertion fails (e.g. quota limit reached), clean up uploaded storage file
    await supabase.storage.from('krasola-images').remove([storagePath]);
    throw new Error(metaError.message);
  }

  return record;
}

export async function fetchUserImages(user) {
  if (!isSupabaseConfigured || !user) return [];
  try {
    const { data, error } = await supabase
      .from('user_images')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) return data;
  } catch (e) {
    console.warn("Error fetching user images:", e);
  }
  return [];
}

export async function deleteUserImage(imageId, storagePath, user) {
  if (!isSupabaseConfigured || !user) return false;
  try {
    // 1. Delete from PostgreSQL metadata table (triggers quota reduction)
    const { error: metaErr } = await supabase
      .from('user_images')
      .delete()
      .eq('id', imageId)
      .eq('user_id', user.id);

    if (metaErr) throw metaErr;

    // 2. Delete binary from storage bucket
    if (storagePath) {
      await supabase.storage.from('krasola-images').remove([storagePath]);
    }
    return true;
  } catch (e) {
    console.error("Error deleting image:", e);
    throw e;
  }
}

export async function fetchCommunityImages() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('user_images')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (!error && data) return data;
  } catch (e) {
    console.warn("Error fetching community images:", e);
  }
  return [];
}

export async function getUserStorageQuota(user) {
  if (!isSupabaseConfigured || !user) return null;
  try {
    const { data, error } = await supabase
      .from('user_storage_quotas')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) return data;
  } catch (e) {
    console.warn("Error loading user storage quota:", e);
  }
  return { used_bytes: 0, max_bytes: 52428800, image_count: 0, max_images: 30 };
}
