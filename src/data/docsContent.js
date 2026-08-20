/**
 * Krasola Official User Guides & Documentation Store
 * User-Centric: Focused on platform features, how-to guides, workflows, tips, shortcuts & best practices.
 */

export const DOCS_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'Rocket',
    description: 'Learn how to navigate the workspace, install the app, and master the shortcuts.',
    items: ['overview', 'quickstart-guide', 'pwa-installation', 'command-palette-shortcuts']
  },
  {
    id: 'creative-studios',
    title: 'Design & Creative Studios',
    icon: 'Palette',
    description: 'Step-by-step guides for Palette Lab, Pattern Studio, Icon Finder, and Image Studio.',
    items: ['palette-lab-guide', 'pattern-studio-guide', 'icon-finder-guide', 'image-studio-guide']
  },
  {
    id: 'vault-collaboration',
    title: 'Vault, Cloud & Sharing',
    icon: 'Database',
    description: 'Managing saved assets, organizing collections, cloud backup, and sharing publicly.',
    items: ['saved-assets-vault', 'cloud-sync-backup', 'activity-quota-management']
  },
  {
    id: 'customization-support',
    title: 'Customization & Themes',
    icon: 'Cpu',
    description: 'Personalizing your workspace with 7 themes, custom presets, and system settings.',
    items: ['theme-studio-guide', 'workspace-preferences', 'release-notes']
  }
];

export const DOCS_SECTIONS = {
  'overview': {
    id: 'overview',
    categoryId: 'getting-started',
    title: 'Welcome to Krasola Workspace',
    subtitle: 'The all-in-one creative productivity suite for designers, developers, and creators.',
    readTime: '3 min read',
    tags: ['Overview', 'Welcome', 'Basics'],
    content: [
      {
        type: 'paragraph',
        text: 'Krasola is a unified creative workstation designed to streamline everyday design and frontend workflows. Instead of jumping between 5 different browser tabs, color generators, pattern makers, icon converters, and image editors, Krasola brings all these tools into a single, high-performance dashboard that runs lightning-fast in your browser.'
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Instant & Private by Design',
        text: 'All color calculations, pattern generations, icon customizations, and image editing happen directly in your browser. Your designs stay private on your device with optional one-click cloud backup.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'What You Can Do with Krasola'
      },
      {
        type: 'table',
        headers: ['Studio / Tool', 'What It Does', 'Key Capabilities & Export Options'],
        rows: [
          ['🎨 Palette Lab', 'Generate, extract, and test color schemes', '5-color harmonies, HSL adjustments, WCAG contrast verification, CSS/Tailwind export'],
          ['✨ Pattern Studio', 'Create seamless vector background patterns', '16 procedural patterns, angle/scale/stroke tuning, SVG & CSS DataURI export'],
          ['🔍 Icon Finder', 'Search and customize 1,000+ vector icons', 'Live stroke width, scale, rotation, color tinting, SVG & React JSX export'],
          ['🖼️ Image Studio', 'Search free imagery, edit and compress photos', 'Canvas filters, 5-color palette extraction, modern WebP compression'],
          ['📂 Saved Assets', 'Centralized vault for all your creative work', 'Tagging, 1-click loading back into studios, public showcase sharing'],
          ['⚡ Command Palette', 'Instant keyboard navigation (Ctrl+K)', 'Jump between studios, switch themes, search commands instantly']
        ]
      }
    ]
  },

  'quickstart-guide': {
    id: 'quickstart-guide',
    categoryId: 'getting-started',
    title: 'Quickstart: 5-Minute Tour',
    subtitle: 'Learn the core workflows to get the most out of your creative workspace.',
    readTime: '4 min read',
    tags: ['Quickstart', 'Tutorial', 'Walkthrough'],
    content: [
      {
        type: 'paragraph',
        text: 'Follow this 3-step workflow to create a complete project palette, generate a matching background pattern, and export code ready for your app or website.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'Step 1: Generate & Lock Your Color Palette'
      },
      {
        type: 'list',
        items: [
          'Navigate to Palette Lab from the sidebar or press Ctrl+K and type "Palette".',
          'Press Spacebar to randomize color harmonies until you find colors you like.',
          'Hover over any color swatch and click the Lock icon to keep your favorite colors while continuing to randomize the rest.',
          'Check the WCAG Contrast tab to ensure your text and background colors meet accessibility standards.'
        ]
      },
      {
        type: 'heading',
        level: 2,
        title: 'Step 2: Design a Seamless Pattern with Your Palette'
      },
      {
        type: 'list',
        items: [
          'Switch to Pattern Studio. Your active palette colors automatically sync across studios!',
          'Select a pattern formula (e.g. Isometric Grid, Waves, Polka Dots, Memphis).',
          'Use the interactive sliders to adjust scale, stroke thickness, angle, and tile dimensions.',
          'Click "Inspire Me" to generate exciting randomized combinations based on your current colors.'
        ]
      },
      {
        type: 'heading',
        level: 2,
        title: 'Step 3: Export Clean Assets & Code'
      },
      {
        type: 'paragraph',
        text: 'Click the Export tab in any studio to copy CSS variables, Tailwind configuration, React JSX code, or download clean SVG vector files with a single click.'
      }
    ]
  },

  'pwa-installation': {
    id: 'pwa-installation',
    categoryId: 'getting-started',
    title: 'Installing Krasola as a Desktop / Mobile App',
    subtitle: 'Run Krasola as an independent native application on Windows, Mac, iOS, and Android.',
    readTime: '3 min read',
    tags: ['PWA', 'Installation', 'Offline', 'Desktop'],
    content: [
      {
        type: 'paragraph',
        text: 'Krasola is a Progressive Web Application (PWA), meaning you can install it directly onto your computer, tablet, or smartphone without visiting an app store.'
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Benefits of Installing',
        text: 'Runs in its own distraction-free window, launches instantly from your desktop or home screen, works offline for core generators, and takes up minimal disk space (< 2MB).'
      },
      {
        type: 'heading',
        level: 2,
        title: 'How to Install on Desktop (Chrome, Edge, Brave)'
      },
      {
        type: 'list',
        items: [
          'Look for the "Install App" button in the Krasola sidebar or header, or click the install icon in your browser URL bar.',
          'Click "Install" when prompted by your browser.',
          'Krasola will launch in a dedicated app window and add a shortcut to your desktop/start menu.'
        ]
      },
      {
        type: 'heading',
        level: 2,
        title: 'How to Install on iOS (iPhone / iPad)'
      },
      {
        type: 'list',
        items: [
          'Open Krasola in Safari on your iPhone or iPad.',
          'Tap the Share button (the square with an arrow pointing up) at the bottom of the screen.',
          'Scroll down and tap "Add to Home Screen", then tap "Add" in the top right corner.'
        ]
      }
    ]
  },

  'command-palette-shortcuts': {
    id: 'command-palette-shortcuts',
    categoryId: 'getting-started',
    title: 'Command Palette & Keyboard Shortcuts',
    subtitle: 'Speed up your workflow with universal keyboard navigation and instant search.',
    readTime: '2 min read',
    tags: ['Shortcuts', 'Command Palette', 'Keyboard', 'Hotkeys'],
    content: [
      {
        type: 'paragraph',
        text: 'Power users can control nearly everything in Krasola using the universal Command Palette and keyboard hotkeys without taking their hands off the keyboard.'
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Universal Shortcut: Ctrl + K (or Cmd + K)',
        text: 'Press Ctrl+K anywhere in the application to open the Command Palette. Type to search studios, switch themes, open settings, or trigger quick actions.'
      },
      {
        type: 'table',
        headers: ['Shortcut', 'Where It Works', 'What It Does'],
        rows: [
          ['Ctrl + K / Cmd + K', 'Everywhere', 'Opens the global Command Search Hub'],
          ['Space', 'Palette Lab', 'Randomize color palette harmonies'],
          ['1, 2, 3, 4, 5', 'Palette Lab', 'Quick toggle lock on column 1 through 5'],
          ['Ctrl + S / Cmd + S', 'Palette / Pattern', 'Open the Save Asset dialog'],
          ['Esc', 'Modals / Drawers', 'Close active modal, drawer, or search dialog'],
          ['↑ / ↓ + Enter', 'Command Palette', 'Navigate through search results and execute']
        ]
      }
    ]
  },

  'palette-lab-guide': {
    id: 'palette-lab-guide',
    categoryId: 'creative-studios',
    title: 'Palette Lab: User Guide & Features',
    subtitle: 'Master color harmonies, HSL adjustments, and accessibility validation.',
    readTime: '5 min read',
    tags: ['Palette Lab', 'Color Schemes', 'WCAG', 'Export'],
    content: [
      {
        type: 'paragraph',
        text: 'Palette Lab is your dedicated color laboratory for discovering, refining, and exporting stunning color combinations for digital products, branding, and user interfaces.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'Core Tools & Sub-Views'
      },
      {
        type: 'list',
        items: [
          'Generator Canvas: The main interactive playground. Hit Space to generate harmonies, lock favorite swatches, and drag columns to reorder.',
          'Explorer Hub: Browse curated preset palettes categorized by mood (e.g. Modern UI, Pastel Calm, Sunset Glow, Cyberpunk). Click any preset to load it directly into your workspace.',
          'Extractor Studio: Upload any image or photo to automatically detect and extract its 5 dominant colors.',
          'Accessibility Lab: Real-time WCAG 2.1 contrast checker. See whether any text color meets AA (4.5:1) or AAA (7:1) readability ratings against background colors.',
          'Visualizer Arena: Preview your active palette rendered across real UI mockups (landing pages, mobile dashboards, button states, and charts).'
        ]
      },
      {
        type: 'heading',
        level: 2,
        title: 'Export Options'
      },
      {
        type: 'paragraph',
        text: 'Palette Lab lets you export your colors in formats ready for any developer stack: CSS Custom Properties (--color-1), Tailwind CSS config object, JSON array, or download vector SVG swatches.'
      }
    ]
  },

  'pattern-studio-guide': {
    id: 'pattern-studio-guide',
    categoryId: 'creative-studios',
    title: 'Pattern Studio: Vector Backgrounds',
    subtitle: 'Create seamless repeating vector textures and geometric graphics.',
    readTime: '5 min read',
    tags: ['Pattern Studio', 'SVG', 'Textures', 'Backgrounds'],
    content: [
      {
        type: 'paragraph',
        text: 'Pattern Studio allows you to create high-resolution, infinitely scalable vector patterns for website backgrounds, UI cards, illustrations, and print materials.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'Pattern Customization Controls'
      },
      {
        type: 'list',
        items: [
          'Pattern Formulas: Choose from 16 distinct geometric styles including Isometric Grids, Waves, Topographic Contours, Polka Dots, Herringbone, Crosses, and Hexagons.',
          'Tile Dimensions: Adjust Width and Height to change pattern density and repetition intervals.',
          'Scale & Zoom: Dynamically scale elements from subtle micro-textures to bold hero graphics.',
          'Stroke Width & Angle: Fine-tune line thickness and rotation angles from 0° to 360°.',
          'Color Palette Link: Toggle palette syncing to automatically apply your active Palette Lab colors to the pattern background and foreground elements.'
        ]
      },
      {
        type: 'heading',
        level: 2,
        title: 'Exporting Your Patterns'
      },
      {
        type: 'paragraph',
        text: 'Export your pattern as a clean SVG file, a high-resolution PNG image, or a 1-click CSS DataURI background snippet ready to paste directly into your stylesheet.'
      }
    ]
  },

  'icon-finder-guide': {
    id: 'icon-finder-guide',
    categoryId: 'creative-studios',
    title: 'Icon Finder: Vector Icons Library',
    subtitle: 'Search, customize, and export over 1,000+ crisp Lucide vector icons.',
    readTime: '3 min read',
    tags: ['Icon Finder', 'Lucide Icons', 'SVG', 'React JSX'],
    content: [
      {
        type: 'paragraph',
        text: 'Icon Finder provides instant access to the entire Lucide icon library with real-time keyword search, interactive customization, and multiple export formats.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'How to Customize Icons'
      },
      {
        type: 'list',
        items: [
          'Search: Type any term (e.g. "user", "cloud", "arrow", "settings") to filter icons with instant fuzzy matching.',
          'Size & Stroke Slider: Adjust icon pixel dimensions (16px to 96px) and stroke weight (1px to 3px) in real time.',
          'Color Tinting: Pick custom colors or click any swatch from your active palette to colorize the icon.',
          'Rotation: Rotate icons in 90° increments or flip horizontally/vertically.'
        ]
      },
      {
        type: 'heading',
        level: 2,
        title: 'One-Click Code Export'
      },
      {
        type: 'paragraph',
        text: 'Click on any icon to copy clean SVG vector code, React JSX syntax (e.g. `<User size={24} color="#6366f1" />`), or save it directly to your personal Saved Assets vault.'
      }
    ]
  },

  'image-studio-guide': {
    id: 'image-studio-guide',
    categoryId: 'creative-studios',
    title: 'Image Studio: Search, Edit & Extract',
    subtitle: 'Search millions of free images, edit on canvas, and compress to WebP.',
    readTime: '4 min read',
    tags: ['Image Studio', 'Photo Search', 'Canvas Editor', 'WebP'],
    content: [
      {
        type: 'paragraph',
        text: 'Image Studio brings together free royalty-free photo search, live browser photo editing, palette extraction, and high-efficiency WebP compression.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'Key Features'
      },
      {
        type: 'list',
        items: [
          'High-Resolution Search: Search millions of curated free photos by keyword, orientation (landscape, portrait, square), and color tone.',
          'Live Canvas Editor: Adjust brightness, contrast, saturation, hue rotation, sepia, and blur with 60 FPS real-time feedback.',
          'Color Palette Extraction: Automatically detect the 5 most dominant colors in any photo and send them to Palette Lab with 1 click.',
          'Client-Side WebP Compression: Compress high-res images by up to 85% with zero quality loss before downloading or saving to the Cloud Vault.'
        ]
      }
    ]
  },

  'saved-assets-vault': {
    id: 'saved-assets-vault',
    categoryId: 'vault-collaboration',
    title: 'Saved Assets Vault: Organization & Management',
    subtitle: 'Store, categorize, reload, and organize all your creative assets in one place.',
    readTime: '3 min read',
    tags: ['Saved Assets', 'Vault', 'Organization', 'Collections'],
    content: [
      {
        type: 'paragraph',
        text: 'The Saved Assets studio is your central library for every color palette, vector pattern, customized icon, and edited image you save while using Krasola.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'Managing Your Saved Items'
      },
      {
        type: 'list',
        items: [
          'Category Tabs: Filter your library by Palettes, Patterns, Icons, or Images.',
          '1-Click Studio Reload: Click "Load into Workspace" on any saved palette or pattern to immediately restore it in its creator studio.',
          'Copy & Export: Copy HEX codes, CSS snippets, or SVG data directly from your saved asset cards without reopening the studios.',
          'Delete & Cleanup: Remove individual assets or clear caches whenever needed.'
        ]
      }
    ]
  },

  'cloud-sync-backup': {
    id: 'cloud-sync-backup',
    categoryId: 'vault-collaboration',
    title: 'Cloud Sync & Public Showcase',
    subtitle: 'Sync designs across all your devices and showcase creations with the community.',
    readTime: '3 min read',
    tags: ['Cloud Sync', 'Account', 'Public Showcase', 'Backup'],
    content: [
      {
        type: 'paragraph',
        text: 'Create a free Krasola account to unlock seamless cloud synchronization across all your computers, laptops, and mobile devices.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'Guest vs. Cloud Account Features'
      },
      {
        type: 'table',
        headers: ['Feature', 'Guest Mode (Offline)', 'Cloud Account (Free)'],
        rows: [
          ['Palette & Pattern Storage', 'Local browser storage', 'Synchronized cloud database'],
          ['Multi-Device Sync', '❌ Limited to single device', '✅ Seamless across all devices'],
          ['Cloud Image Storage', '❌ Browser memory only', '✅ 50MB dedicated image vault'],
          ['Public Showcase Sharing', '❌ Local only', '✅ Toggle assets public/private'],
          ['Auto Guest Migration', 'N/A', '✅ Automatically transfers guest items on login']
        ]
      }
    ]
  },

  'activity-quota-management': {
    id: 'activity-quota-management',
    categoryId: 'vault-collaboration',
    title: 'Usage & Activity Hub',
    subtitle: 'Monitor storage quotas, system performance, and your creative timeline.',
    readTime: '2 min read',
    tags: ['Usage', 'Storage Quota', 'Telemetry', 'Activity'],
    content: [
      {
        type: 'paragraph',
        text: 'The Usage & Activity Hub gives you real-time visibility into your account storage, item counts, and recent creative operations.'
      },
      {
        type: 'list',
        items: [
          'Storage Quota Gauge: View exactly how many megabytes out of your 50MB vault quota you have used.',
          'Asset Breakdown: Visual charts showing the percentage split between saved palettes, patterns, icons, and photos.',
          'Recent Activity Feed: A chronological timeline of your recent saves, exports, and edits.'
        ]
      }
    ]
  },

  'theme-studio-guide': {
    id: 'theme-studio-guide',
    categoryId: 'customization-support',
    title: 'Theme Studio & Color Aesthetics',
    subtitle: 'Personalize Krasola with 7 curated dark and light workspace themes.',
    readTime: '3 min read',
    tags: ['Themes', 'Theme Studio', 'Dark Mode', 'Appearance'],
    content: [
      {
        type: 'paragraph',
        text: 'Krasola includes 7 professionally tuned workspace themes engineered for optimal visual ergonomics, zero eye-strain, and high contrast.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'Built-In Theme Presets'
      },
      {
        type: 'table',
        headers: ['Theme Preset', 'Mode', 'Vibe & Aesthetic'],
        rows: [
          ['Midnight Dark', 'Dark', 'Deep navy-slate workspace with vibrant indigo highlights (Default)'],
          ['Snowy Light', 'Light', 'Crisp, high-contrast daylight workspace with clean slate borders'],
          ['Nordic Frost', 'Dark', 'Arctic-inspired polar night slate with glacial frost cyan accents'],
          ['Dracula Castle', 'Dark', 'Vampiric dark theme with neon purple and gothic accents'],
          ['Gruvbox Retro', 'Dark', 'Warm, earthy groove retro palette with golden yellow highlights'],
          ['Solarized Warm', 'Light', 'Warm daylight cream palette engineered for low eye-strain reading'],
          ['Cyberpunk Neon', 'Dark', 'High-voltage synthwave violet with neon pink & cyan glow']
        ]
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Quick Switching',
        text: 'Click the Theme pill in the desktop header or press Ctrl+K and type the theme name (e.g. "Nord", "Dracula") to switch instantly without reloading the page.'
      }
    ]
  },

  'workspace-preferences': {
    id: 'workspace-preferences',
    categoryId: 'customization-support',
    title: 'Settings & Workspace Preferences',
    subtitle: 'Customize ambient glow, default startup tab, and keyboard helpers.',
    readTime: '2 min read',
    tags: ['Settings', 'Preferences', 'Glow', 'Defaults'],
    content: [
      {
        type: 'paragraph',
        text: 'Customize Krasola to fit your exact working style by visiting the Settings Studio from the sidebar footer.'
      },
      {
        type: 'list',
        items: [
          'Ambient Glow Effects: Toggle background blur ambient lighting on or off for increased performance on older devices.',
          'Default Startup Tab: Choose which studio (Home, Palette Lab, Pattern Studio, etc.) loads automatically when you open Krasola.',
          'Keyboard Shortcut Hints: Toggle on-screen keyboard hints in studio headers.',
          'Data Backup & Restore: Export all your local designs as a JSON backup file or import assets from another device.'
        ]
      }
    ]
  },

  'release-notes': {
    id: 'release-notes',
    categoryId: 'customization-support',
    title: 'Platform Releases & Version Lineage',
    subtitle: 'Stay up to date with new features, improvements, and updates.',
    readTime: '3 min read',
    tags: ['Changelog', 'Updates', 'Releases', 'New Features'],
    content: [
      {
        type: 'paragraph',
        text: 'Krasola follows a continuous release cadence. You can view the full interactive changelog and commit history inside Settings ➔ System Diagnostics.'
      },
      {
        type: 'table',
        headers: ['Release', 'Highlights'],
        rows: [
          ['v1.4.3', 'Official open-source launch with MIT License, community governance documentation, and security disclosure policy.'],
          ['v1.4.2', 'Enhanced About Krasola panel with 1-click diagnostic copying, tech stack architecture cards, creator suites inventory, and GitHub repository links.'],
          ['v1.4.1', 'Fixed Active Palette UI Preview Playground tab switching across UI Card, Metrics Bar, and Action states.'],
          ['v1.4.0', 'Home page overhaul with 3D isometric SVG geometry, 1-click palette randomizer, 6-suite launcher, and UI preview playground.'],
          ['v1.3.3', 'Mobile navigation overhaul for Image Studio and Settings Studio with horizontal scrollable sub-tabs.'],
          ['v1.3.2', 'Automated background update engine with tab focus listener, periodic heartbeat, and In-App Notification Center alerts.'],
          ['v1.3.1', 'User-centric Documentation Studio overhaul focusing on creator feature guides, workflows, and shortcuts.'],
          ['v1.3.0', 'Universal Ctrl+K Command Palette, interactive Theme Studio modal with dynamic swatches, CSS custom property token engine, and navigation de-cluttering.'],
          ['v1.2.3', 'Fixed runtime theme toggle icon imports and mobile light mode switching.'],
          ['v1.2.2', 'Mobile-first platform overhaul with 48px touch targets, bottom dock, and responsive sub-tab carousels.'],
          ['v1.2.1', 'Automated versioning engine and light theme contrast enhancements.'],
          ['v1.2.0', 'Integrated Documentation Studio, secrets redaction architecture, and code blocks.'],
          ['v1.1.0', 'In-App Notification Center with real-time alerts and account diagnostic tools.'],
          ['v1.0.0', 'Initial public release of Krasola Multi-Utility Workspace.']
        ]
      }
    ]
  }
};
