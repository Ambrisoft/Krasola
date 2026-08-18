# In-App Notification Center Architecture & Ring-Buffer Research Report

## 1. Executive Summary
Modern creative workspaces (such as Figma, Linear, Stripe, and Vercel) utilize dedicated in-app notification centers to provide real-time feedback, workflow continuity, and security alerts without interrupting the creator's flow.

This document outlines the technical research, database architecture, Row Level Security (RLS) policies, automatic 50-item ring-buffer pruning triggers, and UI/UX specifications for **Krasola**.

---

## 2. Industry Best Practices & Architecture Patterns

### A. 50-Item Ring-Buffer Pattern (PostgreSQL Capped Collection)
To prevent unlimited database growth while guaranteeing that creators always have access to their 50 most recent activity notices:
1. **Automated Trigger**: An `AFTER INSERT` PostgreSQL trigger (`prune_user_notifications_ring_buffer`) calculates whether the user's notification count exceeds 50 and surgically deletes the oldest records using `OFFSET 50`.
2. **Deterministic Indexing**: Multi-column indexes on `(user_id, created_at DESC)` and `(user_id, is_read)` guarantee sub-millisecond query execution.

### B. Offline & Guest Hybrid Synchronization
1. **Authenticated Users**: Persisted in Supabase PostgreSQL (`public.user_notifications`) with Row Level Security tied to `auth.uid()`.
2. **Guest / Offline Mode**: Stored in `localStorage` ring-buffer (`krasola_local_notifications_v1`) capped at 50 entries.
3. **Login Migration**: When a guest logs in, local notifications are seamlessly synced to their cloud account.

---

## 3. Database Schema Specification

```sql
-- Create User Notifications Table
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'asset_saved', 'quota_alert', 'system', 'export', 'security', 'info'
  category TEXT NOT NULL DEFAULT 'general', -- 'palette', 'pattern', 'image', 'system', 'account'
  action_tab TEXT, -- 'palette', 'pattern', 'imagesearch', 'saved', 'monitoring', 'account'
  action_payload JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for instant reverse chronological retrieval
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_created 
  ON public.user_notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_read 
  ON public.user_notifications (user_id, is_read);

-- Row Level Security (RLS)
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own notifications"
  ON public.user_notifications FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own notifications"
  ON public.user_notifications FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.user_notifications FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.user_notifications FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- PostgreSQL Automatic 50-Item Ring-Buffer Pruning Trigger
CREATE OR REPLACE FUNCTION public.prune_user_notifications_ring_buffer()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.user_notifications
  WHERE id IN (
    SELECT id FROM public.user_notifications
    WHERE user_id = NEW.user_id
    ORDER BY created_at DESC
    OFFSET 50
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER tr_prune_user_notifications
AFTER INSERT ON public.user_notifications
FOR EACH ROW
EXECUTE FUNCTION public.prune_user_notifications_ring_buffer();
```

---

## 4. UI/UX Notification Center Features

| Feature | Description |
|---|---|
| **Header Notification Bell** | Bell icon with dynamic badge displaying unread count (`1..50`). |
| **Slide-Over Panel / Dropdown** | Responsive glassmorphic panel accessible on Desktop and Mobile. |
| **Category Filtering** | Filter by `All`, `Unread`, `Palettes`, `Patterns`, `Images`, `System`. |
| **Bulk Actions** | 1-Click "Mark All as Read" and "Clear Read Notifications". |
| **Interactive Action Cards** | Clicking a notification opens the relevant studio or loads the saved asset. |
| **Relative Timestamps** | Human-readable times ("Just now", "5m ago", "2h ago", "Yesterday"). |
| **Sound & Visual Feedback** | Subtle visual pulse badge on new notifications. |

---

## 5. Event Instrumentation Matrix

1. **Palette Lab**: Dispatched when a palette is generated, saved, or copied.
2. **Pattern Studio**: Dispatched when a pattern is saved, customized, or exported as SVG.
3. **Image Studio**: Dispatched when an image is compressed, colors extracted, or saved.
4. **Cloud Vault & Storage**: Dispatched when quota exceeds 80% or sync completes.
5. **Account & Auth**: Dispatched on login, profile updates, and password changes.
