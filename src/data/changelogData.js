/**
 * Krasola Unified Release Lineage & Changelog History
 * 100% Genuine, factual repository commit history adhering to Keep a Changelog & SemVer 2.0.
 */

export const KRASOLA_CHANGELOG = [
  {
    version: '1.4.0',
    date: '2026-08-18',
    type: 'minor',
    title: 'Home Dashboard Redesign & Live 3D Color Playground',
    commit: 'HEAD',
    summary: 'Comprehensive UI redesign of the Home dashboard featuring solid high-contrast surfaces, code-based 3D isometric SVG geometry, 1-click home palette randomizer, and live UI preview playground.',
    changes: {
      added: [
        'Redesigned Home hero with code-based 3D isometric SVG geometry animating with active palette colors.',
        'Added 1-click Home Palette Randomizer and quick HEX copy tools directly on the home page.',
        'Upgraded Creative Suites launcher to a 6-suite showcase with capability tags.',
        'Integrated live UI Color Preview Playground testing real buttons, metrics, and tags against active colors.'
      ]
    }
  },
  {
    version: '1.3.3',
    date: '2026-08-18',
    type: 'patch',
    title: 'Image Studio & Settings Mobile Navigation Overhaul',
    commit: 'HEAD',
    summary: 'Streamlined responsive sub-navigation in Image Studio and Settings Studio with horizontal scrollable touch strips on mobile screens (< lg) and collapsible sidebars on desktop.',
    changes: {
      changed: [
        'Overhauled Image Studio mobile layout with a horizontal scrollable sub-tab bar for instant access to Search, Extractor, Canvas Editor, Vector, and Export.',
        'Overhauled Settings Studio mobile layout with a horizontal sub-tab bar for General, Appearance, Data Management, and About tabs.',
        'Updated release notes documentation and synchronized SemVer metadata.'
      ]
    }
  },
  {
    version: '1.3.2',
    date: '2026-08-18',
    type: 'patch',
    title: 'Automated Update Detection & Real-Time Notification Engine',
    commit: 'HEAD',
    summary: 'Automated background update checking on mount, tab focus, and 15-minute polling with In-App Notification integration and floating instant reload banner.',
    changes: {
      added: [
        'Automated background update engine checking /version.json on app mount, window focus, and 15-minute intervals.',
        'In-App Notification Center update alerts dispatching system announcements when new versions deploy.',
        'Floating UpdateNotificationBanner component allowing single-click update and instant cache refresh.',
        'applyAppUpdate utility dispatching SKIP_WAITING to Service Worker for zero-downtime updates.'
      ]
    }
  },
  {
    version: '1.3.1',
    date: '2026-08-18',
    type: 'patch',
    title: 'User-Centric Documentation & Feature Guides Overhaul',
    commit: 'HEAD',
    summary: 'Refactored documentation to prioritize user workflows, how-to guides, shortcuts, and platform feature instructions over internal technical backend details.',
    changes: {
      changed: [
        'Transformed Documentation Studio into a practical user guide covering step-by-step studio workflows, tips, shortcuts, and PWA setup.',
        'Removed redundant internal PostgreSQL schemas and raw backend architectures to keep user interface clean and accessible.'
      ]
    }
  },
  {
    version: '1.3.0',
    date: '2026-08-18',
    type: 'minor',
    title: 'Command Palette, Theme Studio & CSS Token Engine',
    commit: 'HEAD',
    summary: 'Universal Ctrl+K Command Palette, interactive Theme Studio modal with dynamic swatches, CSS custom property token engine, and navigation de-cluttering.',
    changes: {
      added: [
        'Universal Ctrl + K Command Palette modal for rapid navigation across all 10 creative studios, theme switching, and quick tools.',
        'Interactive Theme Studio modal with category filtering, real-time color swatches, active ring indicators, and WCAG AA/AAA contrast tags.',
        'CSS Custom Properties design token engine across all 7 themes with zero visual patchwork.',
        'Sleek Command Palette trigger and Theme Studio pill button in desktop header.'
      ],
      fixed: [
        'Fixed mobile 1-tap theme toggle to properly switch between Snowy Light and Midnight Dark.',
        'Fixed Settings Appearance cards to render authentic theme colors instead of hardcoded slate dots.',
        'Fixed global scrollbars in light themes to adapt dynamically via CSS variables.'
      ]
    }
  },
  {
    version: '1.2.3',
    date: '2026-08-18',
    type: 'patch',
    title: 'Theme Icon Import & Runtime Fix',
    commit: '578ae20',
    summary: 'Resolved runtime ReferenceError by importing Sun and Moon icons for mobile theme switching.',
    changes: {
      fixed: [
        'Resolved ReferenceError: Moon is not defined in App.jsx when rendering the mobile 1-tap theme toggle.',
        'Ensured seamless dynamic icon rendering between light and dark modes.'
      ]
    }
  },
  {
    version: '1.2.2',
    date: '2026-08-18',
    type: 'patch',
    title: 'Mobile-First Platform Overhaul & Ergonomics',
    commit: '56da359',
    summary: 'Complete mobile-first UI/UX overhaul featuring thumb-zone ergonomics, bottom sheet drawers, and responsive sub-navigation.',
    changes: {
      added: [
        'Elevated glassmorphism mobile header with active studio switcher, 1-tap theme toggle, and notification bell.',
        'Ergonomic 5-item mobile bottom dock with 48px touch targets and safe-area inset (iOS notch/home-bar) protection.',
        'Categorized "More Studios" bottom sheet with iOS drag handle and grouped quick cards.',
        'Mobile topic selection bottom sheet for Documentation Studio.'
      ],
      changed: [
        'Converted Palette Lab and Pattern Studio sub-sidebars into horizontal scrolling sub-tab carousels on mobile (< lg).'
      ]
    }
  },
  {
    version: '1.2.1',
    date: '2026-08-18',
    type: 'patch',
    title: 'Automated Versioning Engine & Contrast Polish',
    commit: 'ccc77de',
    summary: 'Implemented standalone automated versioning engine scripts/auto-version.js and perfected light theme contrast.',
    changes: {
      added: [
        'Automated release engine scripts/auto-version.js with prebuild sync, smart commit inspection, and PWA cache key rotation.',
        'Release helper scripts: npm run release, release:patch, release:minor, and release:major.'
      ],
      fixed: [
        'Adaptive high-contrast typography across Documentation, Home, and Settings studios for Snowy Light and Cyber Light themes.'
      ]
    }
  },
  {
    version: '1.2.0',
    date: '2026-08-18',
    type: 'minor',
    title: 'Diátaxis Documentation Studio & Redaction Architecture',
    commit: 'ddbea5f',
    summary: 'Full-featured Diátaxis Documentation Studio covering mathematical color algorithms, SVG geometry, WebP canvas compression, and secrets redaction.',
    changes: {
      added: [
        'Full Diátaxis Documentation Studio with 4 core categories: Getting Started, Creative Algorithms, Cloud & Vault, and System Architecture.',
        'Global Ctrl + K fuzzy search modal for instant topic discovery.',
        'Interactive syntax code blocks with 1-click clipboard copy.'
      ],
      security: [
        'Enforced strict 3-tier secrets redaction architecture, ensuring zero production API keys, service roles, or database credentials in user docs.'
      ]
    }
  },
  {
    version: '1.1.0',
    date: '2026-08-17',
    type: 'minor',
    title: 'In-App Notification Center & SemVer Diagnostics',
    commit: '8720cf2',
    summary: 'Real-time In-App Notification Center backed by PostgreSQL 50-item ring buffer trigger, SemVer 2.0 diagnostics, and branded email templates.',
    changes: {
      added: [
        'Unified slide-over Notification Center with unread counter badge, studio deep-linking, and auto-dismiss.',
        'Supabase PostgreSQL trigger tr_prune_user_notifications auto-capping notification logs to 50 entries per user.',
        'System Diagnostics card in Settings with live version checking and build metadata.',
        'Branded minimalist day/night adaptive transactional email templates.'
      ]
    }
  },
  {
    version: '1.0.0',
    date: '2026-08-14',
    type: 'major',
    title: 'Initial Major Production Release',
    commit: '9e54f83',
    summary: 'Official production launch of Krasola Multi-Utility Workspace with unified creative studios, cloud vault, and PWA capabilities.',
    changes: {
      added: [
        'Palette Lab: 5-color harmony generator, HSL adjuster, color wheel, and WCAG 2.1 contrast checker.',
        'Pattern Studio: Parametric SVG pattern generator with 1,024 unique geometric presets and real-time visualizer arena.',
        'Icon Finder: 1,000+ searchable Lucide vector icons with instant SVG/JSX copy.',
        'Image Search & Editor Hub: High-resolution image search with canvas WebP compressor and palette extractor.',
        'Cloud Storage Vault: Supabase-backed user asset management with 50MB storage quota enforcement.',
        'Activity & Usage Hub: Live quota gauges, storage calculators, and activity timeline.',
        'Progressive Web App (PWA): Offline caching, install banners, and standalone desktop/mobile execution.'
      ]
    }
  }
];
