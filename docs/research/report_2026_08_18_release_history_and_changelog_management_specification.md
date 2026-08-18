# Release History & Changelog Management Specification

## 1. Executive Summary
Modern engineering platforms (GitHub, Vercel, Supabase, Stripe, Tailwind) manage software version histories through **Semantic Versioning 2.0 (SemVer)**, structured **Keep a Changelog** specifications, programmatic JSON/JS data stores, and in-app timeline interfaces.

This document outlines industry best practices and establishes Krasola's unified version history architecture.

---

## 2. Industry Benchmark: How Leading Platforms Manage Version History

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Platform Release Flow                                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  1. Source Control (Git)       │  • Conventional Commits (feat, fix, chore, refactor)  │
│                                │  • Immutable Commit SHAs & Tagged Releases            │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│  2. Single Source of Truth     │  • CHANGELOG.md (Keep a Changelog 1.0.0 format)       │
│                                │  • src/data/changelogData.js (Structured JSON schema) │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│  3. In-App User Interfaces     │  • Settings > System Diagnostics > Release Timeline   │
│                                │  • Documentation > Changelog & Release Notes          │
│                                │  • PWA Update Banners ("What's New in v1.2.3")        │
└────────────────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 3. Krasola Version Lineage & Release Catalog (100% Genuine History)

### 📌 `v1.2.3` (Patch) — 2026-08-18
* **Commit:** `578ae20`
* **Type:** `Fixed`
* **Changes:**
  * **Fixed:** Resolved `ReferenceError: Moon is not defined` by importing `Sun` and `Moon` icons from `lucide-react` in `src/App.jsx`.

### 📌 `v1.2.2` (Patch) — 2026-08-18
* **Commit:** `56da359`
* **Type:** `Added` & `Changed`
* **Changes:**
  * **Added:** Mobile-first navigation overhaul with 48px touch targets, elevated glassmorphism header, and notch safe-area protection.
  * **Added:** Categorized "More Studios" bottom sheet with iOS drag handle (*Creative Studios*, *Cloud & Account*, *Guides & Settings*).
  * **Added:** Documentation Studio mobile topic selector bottom sheet.
  * **Changed:** Converted Palette Lab and Pattern Studio sub-sidebars into horizontal scrolling sub-tab carousels on mobile (< lg).

### 📌 `v1.2.1` (Patch) — 2026-08-18
* **Commit:** `ccc77de` / `a54e8f4`
* **Type:** `Added` & `Fixed`
* **Changes:**
  * **Added:** Automated versioning lifecycle engine ([scripts/auto-version.js](file:///a:/Multi%20Utility/scripts/auto-version.js)) with prebuild sync and smart commit inspection.
  * **Fixed:** Adaptive high-contrast light mode typography across Documentation, Home, and Settings studios.

### 📌 `v1.2.0` (Minor) — 2026-08-18
* **Commit:** `ddbea5f` / `e6e1b60`
* **Type:** `Added` & `Security`
* **Changes:**
  * **Added:** Full Diátaxis Documentation Studio covering mathematical color algorithms, SVG geometry, WebP canvas compression, and database schemas.
  * **Added:** Global `Ctrl + K` fuzzy search modal and 1-click syntax copy code blocks.
  * **Security:** Enforced strict secrets redaction policy, masking all API keys and suppressing internal credentials.

### 📌 `v1.1.0` (Minor) — 2026-08-17
* **Commit:** `8720cf2` / `22863f0`
* **Type:** `Added` & `Changed`
* **Changes:**
  * **Added:** Real-time In-App Notification Center backed by PostgreSQL 50-item ring buffer trigger `tr_prune_user_notifications`.
  * **Added:** Automated PWA cache key rotation and `version.json` build-time injection.
  * **Changed:** Redesigned transactional email templates with minimalist day/night adaptive themes.

### 📌 `v1.0.0` (Major) — 2026-08-14
* **Commit:** `9e54f83` / `100be26`
* **Type:** `Added`
* **Changes:**
  * **Added:** Initial production release of Krasola Multi-Utility Workspace.
  * **Added:** Palette Lab, Pattern Studio (1,024 geometric patterns), Icon Finder (1,000+ SVGs), Image Search with Canvas WebP compressor.
  * **Added:** Supabase Cloud Storage Vault, Activity & Quota Monitoring Hub (50MB live tracking), and Standalone PWA Engine.
