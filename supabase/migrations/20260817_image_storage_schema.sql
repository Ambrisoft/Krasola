-- ==============================================================================
-- Migration: 20260817_image_storage_schema.sql
-- Description: Creates image metadata table, user quota tracking, triggers,
--              and storage bucket setup with RLS policies for Krasola.
-- ==============================================================================

-- 1. Create storage bucket 'krasola-images' if not already created
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'krasola-images',
  'krasola-images',
  TRUE,
  5242880, -- 5 MB raw limit
  ARRAY['image/webp', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/webp', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];

-- 2. Enable Storage RLS Policies
DROP POLICY IF EXISTS "Public can view images in krasola-images" ON storage.objects;
CREATE POLICY "Public can view images in krasola-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'krasola-images');

DROP POLICY IF EXISTS "Authenticated users can upload to own vault in krasola-images" ON storage.objects;
CREATE POLICY "Authenticated users can upload to own vault in krasola-images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'krasola-images'
    AND (
      auth.uid() IS NOT NULL
      OR (storage.foldername(name))[1] = 'public'
    )
  );

DROP POLICY IF EXISTS "Users can delete own image in krasola-images" ON storage.objects;
CREATE POLICY "Users can delete own image in krasola-images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'krasola-images'
    AND (
      auth.uid()::text = (storage.foldername(name))[2]
      OR auth.uid()::text = (storage.foldername(name))[1]
    )
  );

-- 3. Create user metadata table: public.user_images
CREATE TABLE IF NOT EXISTS public.user_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(80) NOT NULL DEFAULT 'Anonymous',
  title VARCHAR(150) NOT NULL DEFAULT 'Untitled Asset',
  creator VARCHAR(100) DEFAULT 'Krasola Studio',
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  width INT DEFAULT 1920,
  height INT DEFAULT 1080,
  file_size_bytes INT DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) on public.user_images
ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access on user_images" ON public.user_images;
CREATE POLICY "Allow read access on user_images"
  ON public.user_images FOR SELECT
  USING (is_public = TRUE OR (auth.uid() = user_id));

DROP POLICY IF EXISTS "Allow insert on user_images for authenticated owner" ON public.user_images;
CREATE POLICY "Allow insert on user_images for authenticated owner"
  ON public.user_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow update on user_images for owner" ON public.user_images;
CREATE POLICY "Allow update on user_images for owner"
  ON public.user_images FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow delete on user_images for owner" ON public.user_images;
CREATE POLICY "Allow delete on user_images for owner"
  ON public.user_images FOR DELETE
  USING (auth.uid() = user_id);

-- 5. User Storage Quotas Table
CREATE TABLE IF NOT EXISTS public.user_storage_quotas (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  used_bytes BIGINT DEFAULT 0,
  max_bytes BIGINT DEFAULT 52428800, -- 50 MB in bytes
  image_count INT DEFAULT 0,
  max_images INT DEFAULT 30,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_storage_quotas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own storage quota" ON public.user_storage_quotas;
CREATE POLICY "Users can read own storage quota"
  ON public.user_storage_quotas FOR SELECT
  USING (auth.uid() = user_id);

-- 6. Quota Enforcement Trigger Function
CREATE OR REPLACE FUNCTION public.check_and_update_image_quota()
RETURNS TRIGGER AS $$
DECLARE
  v_used_bytes BIGINT;
  v_max_bytes BIGINT;
  v_image_count INT;
  v_max_images INT;
BEGIN
  -- Ensure quota record exists for user
  INSERT INTO public.user_storage_quotas (user_id, used_bytes, max_bytes, image_count, max_images)
  VALUES (NEW.user_id, 0, 52428800, 0, 30)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT used_bytes, max_bytes, image_count, max_images
  INTO v_used_bytes, v_max_bytes, v_image_count, v_max_images
  FROM public.user_storage_quotas
  WHERE user_id = NEW.user_id;

  IF (v_image_count + 1 > v_max_images) THEN
    RAISE EXCEPTION 'Image limit reached: Maximum % images allowed on your plan.', v_max_images;
  END IF;

  IF (v_used_bytes + COALESCE(NEW.file_size_bytes, 0) > v_max_bytes) THEN
    RAISE EXCEPTION 'Storage quota exceeded: Maximum % MB total storage allowed.', (v_max_bytes / 1048576);
  END IF;

  -- Update running tally
  UPDATE public.user_storage_quotas
  SET used_bytes = used_bytes + COALESCE(NEW.file_size_bytes, 0),
      image_count = image_count + 1,
      updated_at = NOW()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Quota Reduction on Delete Trigger Function
CREATE OR REPLACE FUNCTION public.reduce_image_quota_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_storage_quotas
  SET used_bytes = GREATEST(0, used_bytes - COALESCE(OLD.file_size_bytes, 0)),
      image_count = GREATEST(0, image_count - 1),
      updated_at = NOW()
  WHERE user_id = OLD.user_id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Bind Triggers to public.user_images
DROP TRIGGER IF EXISTS trg_check_image_quota ON public.user_images;
CREATE TRIGGER trg_check_image_quota
  BEFORE INSERT ON public.user_images
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_update_image_quota();

DROP TRIGGER IF EXISTS trg_reduce_image_quota ON public.user_images;
CREATE TRIGGER trg_reduce_image_quota
  AFTER DELETE ON public.user_images
  FOR EACH ROW
  EXECUTE FUNCTION public.reduce_image_quota_on_delete();
