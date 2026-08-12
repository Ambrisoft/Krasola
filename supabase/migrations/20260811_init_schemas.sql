-- Supabase SQL Schema Migration
-- Migration Name: init_schemas
-- Date: 2026-08-11
-- Target Database: PostgreSQL (Supabase)

-- 1. Setup Platform Curated Palettes Table
CREATE TABLE IF NOT EXISTS platform_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  colors JSONB NOT NULL, -- Array of hex strings e.g. ["#ff5e62", "#ff9966", ...]
  mode VARCHAR(30) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Setup Community Contributed Palettes Table
CREATE TABLE IF NOT EXISTS community_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(80) NOT NULL DEFAULT 'Anonymous Designer',
  name VARCHAR(50) NOT NULL,
  colors JSONB NOT NULL,
  mode VARCHAR(30) NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Setup Platform Curated Pattern Templates Table
CREATE TABLE IF NOT EXISTS platform_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  category VARCHAR(30) NOT NULL,
  default_bg VARCHAR(7) NOT NULL,
  default_color1 VARCHAR(7) NOT NULL,
  default_color2 VARCHAR(7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Setup Community Contributed Patterns Table
CREATE TABLE IF NOT EXISTS community_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(80) NOT NULL DEFAULT 'Anonymous Maker',
  name VARCHAR(50) NOT NULL,
  pattern_type VARCHAR(30) NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  scale NUMERIC NOT NULL,
  stroke INTEGER NOT NULL,
  angle INTEGER NOT NULL,
  bg VARCHAR(7) NOT NULL,
  color1 VARCHAR(7) NOT NULL,
  color2 VARCHAR(7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE platform_palettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_palettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_patterns ENABLE ROW LEVEL SECURITY;

-- 5. Define Access Control Policies

-- platform_palettes: Public read-only; admin write-only
CREATE POLICY "Allow public read access on platform_palettes"
  ON platform_palettes FOR SELECT USING (true);

-- platform_patterns: Public read-only; admin write-only
CREATE POLICY "Allow public read access on platform_patterns"
  ON platform_patterns FOR SELECT USING (true);

-- community_palettes: Public read & like update; authenticated user insert/delete
CREATE POLICY "Allow public read access on community_palettes"
  ON community_palettes FOR SELECT USING (true);

CREATE POLICY "Allow authenticated user insert on community_palettes"
  ON community_palettes FOR INSERT WITH CHECK (true); -- Allow guest submission or authenticated inserts

CREATE POLICY "Allow creator update/delete on community_palettes"
  ON community_palettes FOR ALL USING (auth.uid() = user_id);

-- community_patterns: Public read; authenticated user insert/delete
CREATE POLICY "Allow public read access on community_patterns"
  ON community_patterns FOR SELECT USING (true);

CREATE POLICY "Allow authenticated user insert on community_patterns"
  ON community_patterns FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow creator update/delete on community_patterns"
  ON community_patterns FOR ALL USING (auth.uid() = user_id);

-- 6. Insert Baseline Platform Presets
INSERT INTO platform_palettes (name, colors, mode) VALUES
  ('Sunset Horizon', '["#ff5e62", "#ff9966", "#ff5f6d", "#ffc3a0", "#ffafbd"]', 'Warm'),
  ('Nordic Frost', '["#2e3440", "#3b4252", "#434c5e", "#4c566a", "#88c0d0"]', 'Cool'),
  ('Cyberpunk Glow', '["#0d0221", "#0f082c", "#ff79c6", "#bd93f9", "#8be9fd"]', 'Neon'),
  ('Emerald Luxe', '["#064e3b", "#047857", "#10b981", "#34d399", "#a7f3d0"]', 'Cool')
ON CONFLICT DO NOTHING;

INSERT INTO platform_patterns (key, name, category, default_bg, default_color1, default_color2) VALUES
  ('dots', 'Polka Dots', 'Minimalist', '#0f172a', '#6366f1', '#38bdf8'),
  ('grid', 'Tech Grid Mesh', 'Geometric', '#020617', '#3b82f6', '#60a5fa'),
  ('waves', 'Sine Wave Ripples', 'Flow', '#042f2e', '#14b8a6', '#2dd4bf')
ON CONFLICT DO NOTHING;

-- 7. Public User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  bio TEXT DEFAULT '',
  avatar_style VARCHAR(30) DEFAULT 'geometric',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow user insert on profiles"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow user update on profiles"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, bio, avatar_style)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_style', 'geometric')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
