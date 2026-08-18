# Changelog

All notable changes to the **Krasola Multi-Utility Workspace** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.1] - 2026-08-18

### Changed
- Complete overhaul of Documentation Studio: Removed internal backend architectures, DDLs, and raw configuration tables, replacing them with user-centric feature guides, tutorials, workflows, shortcuts, and best practices.

---

## [1.3.0] - 2026-08-18

### Added
- Universal `Ctrl + K` / `Cmd + K` Command Palette modal with instant fuzzy search across all 10 creative studios, all 7 themes, and quick actions.
- Interactive Theme Studio modal with category filters (*All*, *Dark*, *Light*), real-time color swatches, active indicator rings, and WCAG AA/AAA contrast tags.
- CSS Custom Properties Design Token system (`--bg-app`, `--bg-surface`, `--color-accent`, etc.) supporting all 7 themes (*Midnight Dark*, *Snowy Light*, *Nordic Frost*, *Dracula Castle*, *Gruvbox Retro*, *Solarized Warm*, *Cyberpunk Neon*).
- Streamlined desktop header with Command Palette trigger and Theme Studio pill.

### Fixed
- Fixed mobile Sun/Moon quick toggle (`BUG-01`) to map to valid theme IDs (`slate-light` and `slate-dark`).
- Fixed Settings Appearance preview cards (`BUG-02`) to render authentic theme colors instead of hardcoded slate/indigo swatches.
- Fixed global scrollbars (`BUG-03`) to dynamically adapt to dark and light modes via CSS variables.

---

## [1.2.3] - 2026-08-18 (Commit `578ae20`)

### Fixed
- Resolved `ReferenceError: Moon is not defined` in `src/App.jsx` when rendering the mobile 1-tap theme toggle.
- Added explicit `Sun` and `Moon` icon imports from `lucide-react`.

---

## [1.2.2] - 2026-08-18 (Commit `56da359`)

### Added
- Mobile-first platform UI/UX overhaul with 48px touch targets and notch/safe-area (`env(safe-area-inset-bottom)`) protection.
- Elevated glassmorphism mobile header with active studio switcher, 1-tap theme toggle, and live notification bell badge.
- Ergonomic 5-item mobile bottom dock with glowing active indicators.
- Categorized "More Studios" bottom sheet with iOS drag handle (*Creative Studios*, *Cloud & Account*, *Guides & Settings*).
- Mobile topic selection bottom sheet for Documentation Studio.

### Changed
- Converted Palette Lab and Pattern Studio sub-sidebars into horizontal scrolling sub-tab carousels on mobile screens (`< lg`), maximizing canvas viewing area.

---

## [1.2.1] - 2026-08-18 (Commit `ccc77de`)

### Added
- Standalone automated versioning engine [`scripts/auto-version.js`](scripts/auto-version.js) with smart commit inspection, prebuild sync, and PWA cache key rotation.
- Release automation scripts in `package.json` (`npm run release`, `release:patch`, `release:minor`, `release:major`).

### Fixed
- Enhanced text contrast across Documentation, Home, and Settings studios for Snowy Light and Cyber Light themes.

---

## [1.2.0] - 2026-08-18 (Commit `ddbea5f`)

### Added
- Comprehensive Diátaxis Documentation Studio covering mathematical color algorithms, SVG geometry, WebP canvas compression, and database schemas.
- Global `Ctrl + K` fuzzy search modal and 1-click syntax code blocks.

### Security
- Enforced strict 3-tier secrets redaction policy, masking all API keys and suppressing internal credentials.

---

## [1.1.0] - 2026-08-17 (Commit `8720cf2`)

### Added
- In-App Notification Center backed by Supabase PostgreSQL trigger `tr_prune_user_notifications` (50-item ring buffer).
- Automated PWA cache key rotation and `public/version.json` build-time injection.
- System Diagnostics card in Settings with live version checking and build metadata.
- Branded minimalist day/night adaptive transactional email templates.

---

## [1.0.0] - 2026-08-14 (Commit `9e54f83`)

### Added
- Initial major production release of Krasola Multi-Utility Workspace.
- **Palette Lab**: 5-color harmony generator, HSL adjuster, color wheel, and WCAG 2.1 contrast checker.
- **Pattern Studio**: Parametric SVG pattern generator with 1,024 unique geometric presets and real-time visualizer arena.
- **Icon Finder**: 1,000+ searchable Lucide vector icons with instant SVG/JSX copy.
- **Image Search & Editor Hub**: High-resolution image search with canvas WebP compressor and palette extractor.
- **Cloud Storage Vault**: Supabase-backed user asset management with 50MB storage quota enforcement.
- **Activity & Usage Hub**: Live quota gauges, storage calculators, and activity timeline.
- **Progressive Web App (PWA)**: Offline caching, install banners, and standalone desktop/mobile execution.
