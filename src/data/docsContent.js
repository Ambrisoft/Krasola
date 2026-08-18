/**
 * Krasola Official Documentation Content Store
 * STRICT INTEGRITY: 100% Genuine, Active Codebase Data (No Mock/Fake Information)
 */

export const DOCS_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'Rocket',
    description: 'Introduction, architecture philosophy, and progressive web app setup.',
    items: ['overview', 'architecture', 'pwa-installation']
  },
  {
    id: 'creative-studios',
    title: 'Creative Studios',
    icon: 'Palette',
    description: 'Deep dives into Palette Lab, Pattern Studio, Image Search, and Icon Finder.',
    items: ['palette-lab', 'pattern-studio', 'image-search', 'icon-finder']
  },
  {
    id: 'cloud-security',
    title: 'Cloud & Database',
    icon: 'Database',
    description: 'PostgreSQL schemas, Row Level Security (RLS), and 50MB vault quotas.',
    items: ['cloud-vault', 'database-schemas', 'rls-policies', 'custom-smtp', 'security-redaction']
  },
  {
    id: 'platform-systems',
    title: 'Platform Architecture',
    icon: 'Cpu',
    description: 'In-App Notification Center ring buffer, SemVer 2.0, release history, and shortcuts.',
    items: ['notifications-engine', 'version-control', 'release-history', 'keyboard-shortcuts']
  }
];

export const DOCS_SECTIONS = {
  'overview': {
    id: 'overview',
    categoryId: 'getting-started',
    title: 'Workspace Overview & Philosophy',
    subtitle: 'High-performance creative suite uniting color science, vector geometry, and cloud sync.',
    readTime: '4 min read',
    tags: ['Introduction', 'Overview', 'Core'],
    content: [
      {
        type: 'paragraph',
        text: 'Krasola is an enterprise-grade multi-utility design workspace engineered to bridge the gap between creative prototyping and frontend code generation. Built on React 18 and Vite 6, the suite runs entirely client-side inside browser sandboxes with real-time cloud synchronization via Supabase PostgreSQL.'
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Core Philosophy: Privacy & Zero Lock-in',
        text: 'All color generations, pattern math, image compressions, and icon searches execute locally on your device with zero cloud latency. Cloud storage is 100% opt-in with end-to-end Row Level Security.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'Integrated Studio Modules'
      },
      {
        type: 'table',
        headers: ['Studio', 'Primary Capability', 'Export Formats'],
        rows: [
          ['Palette Lab', 'Algorithmic color harmony generation & WCAG 2.1 contrast math', 'CSS, Tailwind, SCSS, JSON, Swift, Android'],
          ['Pattern Studio', 'Procedural SVG vector pattern geometry & Bézier curves', 'Clean SVG, High-Res PNG, CSS DataURI'],
          ['Image Search Hub', 'High-res curation with Canvas lossy/lossless WebP compression', 'WebP, JPEG, PNG with EXIF stripping'],
          ['Icon Finder', 'Lucide vector search with real-time stroke/size manipulation', 'Raw SVG, React JSX Component'],
          ['Cloud Vault', 'Private 50MB storage quota with public showcase toggle', 'PostgreSQL JSONB / Storage Buckets'],
          ['Notification Center', 'Real-time studio alerts with 50-item PostgreSQL ring buffer', 'Live Sync & Local Fallback']
        ]
      }
    ]
  },

  'architecture': {
    id: 'architecture',
    categoryId: 'getting-started',
    title: 'Technology Stack & Engine Architecture',
    subtitle: 'Under the hood of Krasola: Bundling, State, and Database pipelines.',
    readTime: '5 min read',
    tags: ['Architecture', 'React 18', 'Vite 6', 'Tailwind'],
    content: [
      {
        type: 'paragraph',
        text: 'Krasola is architected using a decoupled modular structure where independent studio tools share unified Theme, Toast, and Notification contexts.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'Core Technology Stack'
      },
      {
        type: 'list',
        items: [
          'Frontend Framework: React 18.2 with StrictMode and Concurrent Rendering.',
          'Build Tool & Dev Server: Vite 6.2 with Rollup code-splitting and content hashing.',
          'Styling Engine: Vanilla Tailwind CSS 3.4 with custom theme tokens & dark mode.',
          'Icons Suite: Lucide React (over 1,000+ tree-shaken vector icons).',
          'Cloud & Database: Supabase PostgreSQL with RLS, GoTrue Auth, and Storage Buckets.',
          'Transactional Email: Custom SMTP via Resend API on Port 587 (TLS).'
        ]
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Local Development & Build Commands',
        code: `# Install dependencies with legacy peer dependency resolution
npm install

# Launch Vite development server on http://localhost:3000
npm run dev

# Compile optimized production bundle into /dist
npm run build

# Run local production preview server
npm run preview`
      }
    ]
  },

  'pwa-installation': {
    id: 'pwa-installation',
    categoryId: 'getting-started',
    title: 'Progressive Web App (PWA) Setup',
    subtitle: 'Run Krasola as an independent native application across Desktop and Mobile.',
    readTime: '3 min read',
    tags: ['PWA', 'ServiceWorker', 'Offline'],
    content: [
      {
        type: 'paragraph',
        text: 'Krasola is a certified Progressive Web Application equipped with a standalone Web App Manifest, high-resolution vector icons, and an active Service Worker (`sw.js`).'
      },
      {
        type: 'callout',
        variant: 'important',
        title: 'Service Worker Cache Lifecycle',
        text: 'The Service Worker utilizes the cache key `krasola-pwa-v1.1.0`. During updates, the `activate` event automatically purges older cache stores to prevent stale JavaScript execution.'
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Service Worker Cache Invalidation (public/sw.js)',
        code: `// Activate Event - Clean up stale cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});`
      }
    ]
  },

  'palette-lab': {
    id: 'palette-lab',
    categoryId: 'creative-studios',
    title: 'Palette Lab & Color Science',
    subtitle: 'Mathematical color harmonies, HSL manipulation, and WCAG 2.1 accessibility algorithms.',
    readTime: '6 min read',
    tags: ['Palette Lab', 'WCAG 2.1', 'Color Theory', 'HSL'],
    content: [
      {
        type: 'paragraph',
        text: 'Palette Lab combines artistic color harmony theory with mathematically rigorous accessibility validation based on W3C Web Content Accessibility Guidelines (WCAG 2.1).'
      },
      {
        type: 'heading',
        level: 2,
        title: 'WCAG 2.1 Relative Luminance & Contrast Formula'
      },
      {
        type: 'paragraph',
        text: 'To determine whether a text color passes AA (4.5:1) or AAA (7:1) contrast against a background, Krasola first converts sRGB color channels to linear relative luminance (L):'
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Relative Luminance Calculation (sRGB to Linear L)',
        code: `function getLuminance(r, g, b) {
  const [lr, lg, lb] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function getContrastRatio(hex1, hex2) {
  const L1 = getLuminance(...hexToRgb(hex1));
  const L2 = getLuminance(...hexToRgb(hex2));
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}`
      },
      {
        type: 'heading',
        level: 2,
        title: 'Supported Color Harmonies'
      },
      {
        type: 'list',
        items: [
          'Monochromatic: Shifts in lightness (L) and saturation (S) while keeping hue (H) fixed.',
          'Analogous: Adjacent hues within 30° on the 360° color wheel.',
          'Complementary: Direct opposite hues separated by exactly 180°.',
          'Triadic: Three equidistant colors separated by 120° angles.',
          'Tetradic (Dual Complementary): Four colors arranged into two complementary pairs (90° offset).'
        ]
      }
    ]
  },

  'pattern-studio': {
    id: 'pattern-studio',
    categoryId: 'creative-studios',
    title: 'Pattern Studio & Vector Geometry',
    subtitle: 'Procedural SVG generation, Bézier curve math, and real-time canvas rendering.',
    readTime: '5 min read',
    tags: ['Pattern Studio', 'SVG', 'Bézier', 'Vector'],
    content: [
      {
        type: 'paragraph',
        text: 'Pattern Studio enables creators to generate infinite seamless repeating vector patterns with customizable scale, rotation, stroke width, opacity, and color palettes.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'Supported Pattern Algorithms'
      },
      {
        type: 'table',
        headers: ['Pattern Type', 'Mathematical Base', 'Customizable Parameters'],
        rows: [
          ['Isometric Grid', '30°/60° Trigonometric diamond matrix', 'Grid spacing, stroke width, isometric angle'],
          ['Polka Dots', 'Equidistant Cartesian circle array', 'Dot radius, horizontal & vertical gap'],
          ['Waves & Curvature', 'Cubic Bézier curves: C x1 y1, x2 y2, x y', 'Amplitude, frequency, line thickness'],
          ['Chevron & Herringbone', 'Interlocking 45° vector segments', 'Segment width, tilt angle, row offset'],
          ['Topographic Contours', 'Multi-layered Perlin noise elevation paths', 'Complexity, density, smooth curves'],
          ['Memphis Geometric', 'Randomized scatter of triangles, squiggles, & crosses', 'Density, element scale, scatter seed']
        ]
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Clean SVG DataURI Export Pipeline',
        code: `// Generate CSS Base64 Background URI
export const svgToCssDataUri = (svgString) => {
  const cleanSvg = svgString
    .replace(/\\n/g, '')
    .replace(/\\s+/g, ' ')
    .replace(/[{}]/g, '');
  return \`url("data:image/svg+xml;utf8,\${encodeURIComponent(cleanSvg)}")\`;
};`
      }
    ]
  },

  'image-search': {
    id: 'image-search',
    categoryId: 'creative-studios',
    title: 'Image Search Hub & Canvas Compression Engine',
    subtitle: 'Unsplash API integration and browser-native lossy/lossless WebP compression.',
    readTime: '5 min read',
    tags: ['Image Studio', 'WebP', 'Canvas', 'Unsplash'],
    content: [
      {
        type: 'paragraph',
        text: 'The Image Search Hub allows creators to curate high-resolution imagery, perform client-side Canvas editing (brightness, contrast, hue, saturation, blur), and compress images by up to 85% using modern WebP formats before saving to the Cloud Vault.'
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Client-Side Canvas Compression Pipeline',
        text: 'Images are drawn to an off-screen HTML5 `<canvas>` element and exported via `canvas.toBlob(callback, "image/webp", quality)`. This strips bulky camera EXIF metadata and optimizes storage quota.'
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Off-screen Canvas Compression Engine (src/utils/imageCompression.js)',
        code: `export const compressImageBlob = async (file, quality = 0.85, maxWidth = 1920) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = maxWidth / Math.max(img.width, maxWidth);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob), 'image/webp', quality);
    };
    img.src = URL.createObjectURL(file);
  });
};`
      }
    ]
  },

  'icon-finder': {
    id: 'icon-finder',
    categoryId: 'creative-studios',
    title: 'Icon Finder Studio',
    subtitle: 'Instant fuzzy search across 1,000+ vector Lucide icons with 1-click SVG and JSX export.',
    readTime: '3 min read',
    tags: ['Icons', 'Lucide', 'SVG', 'JSX'],
    content: [
      {
        type: 'paragraph',
        text: 'Icon Finder embeds the full Lucide vector catalog with real-time client-side fuzzy keyword matching, interactive stroke adjustments (1px to 3px), color tinting, and 1-click exports for SVG, React JSX, and Vue components.'
      }
    ]
  },

  'cloud-vault': {
    id: 'cloud-vault',
    categoryId: 'cloud-security',
    title: 'Cloud Vault & Storage Quotas',
    subtitle: '50MB creator quota management, public showcase sharing, and offline sync.',
    readTime: '4 min read',
    tags: ['Cloud Vault', 'Storage Quota', '50MB', 'Supabase'],
    content: [
      {
        type: 'paragraph',
        text: 'Every Krasola account includes a dedicated **50MB Cloud Vault**. Storage is calculated across palettes, patterns, and compressed WebP artwork.'
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Automated Quota Calculation',
        text: 'The table `public.user_storage_quotas` tracks `used_bytes` vs `max_bytes (52,428,800 bytes)`. When quota usage exceeds 80%, the system automatically emits a notification.'
      }
    ]
  },

  'database-schemas': {
    id: 'database-schemas',
    categoryId: 'cloud-security',
    title: 'Supabase PostgreSQL Schemas',
    subtitle: 'Exact database table architectures, column definitions, and foreign keys.',
    readTime: '6 min read',
    tags: ['Database', 'PostgreSQL', 'Schemas', 'Supabase'],
    content: [
      {
        type: 'paragraph',
        text: 'Below are the exact production PostgreSQL table definitions deployed in Krasola Supabase database:'
      },
      {
        type: 'code',
        language: 'sql',
        title: 'Production PostgreSQL Table DDLs',
        code: `-- 1. User Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_style TEXT DEFAULT 'geometric',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Platform & Community Palettes
CREATE TABLE public.platform_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  colors JSONB NOT NULL, -- Array of hex strings
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. User Storage Quotas
CREATE TABLE public.user_storage_quotas (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  used_bytes BIGINT DEFAULT 0,
  max_bytes BIGINT DEFAULT 52428800, -- 50 Megabytes
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. User Notifications (50-Item Ring Buffer)
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  category TEXT DEFAULT 'general',
  action_tab TEXT,
  action_payload JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);`
      }
    ]
  },

  'rls-policies': {
    id: 'rls-policies',
    categoryId: 'cloud-security',
    title: 'Row Level Security (RLS) Policies',
    subtitle: 'Security isolation rules ensuring absolute privacy of creator assets.',
    readTime: '4 min read',
    tags: ['Security', 'RLS', 'PostgreSQL', 'Privacy'],
    content: [
      {
        type: 'paragraph',
        text: 'Every table in Krasola enforces PostgreSQL Row Level Security (RLS). Users can only view, mutate, or delete records where `auth.uid() = user_id`, while public community assets are readable by all authenticated users.'
      },
      {
        type: 'code',
        language: 'sql',
        title: 'Row Level Security Policies Sample',
        code: `-- Enable RLS on notifications
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own notifications"
  ON public.user_notifications FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own notifications"
  ON public.user_notifications FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);`
      }
    ]
  },

  'custom-smtp': {
    id: 'custom-smtp',
    categoryId: 'cloud-security',
    title: 'Authentication & Custom SMTP Delivery',
    subtitle: 'Supabase GoTrue Auth connected to Resend on krasola.ambrisoft.com.',
    readTime: '4 min read',
    tags: ['Auth', 'SMTP', 'Resend', 'GoTrue'],
    content: [
      {
        type: 'paragraph',
        text: 'Krasola utilizes Supabase GoTrue Auth with custom SMTP email dispatch powered by Resend for verified transactional email delivery.'
      },
      {
        type: 'table',
        headers: ['Configuration Parameter', 'Production Setting', 'Purpose'],
        rows: [
          ['Sender Email', 'noreply@krasola.ambrisoft.com', 'Matches verified Resend subdomain'],
          ['Sender Name', 'Krasola', 'Brand identifier in inbox'],
          ['SMTP Host', 'smtp.resend.com', 'Resend SMTP Gateway'],
          ['Port Number', '587 (TLS / STARTTLS)', 'Required for GoTrue STARTTLS connection'],
          ['SMTP Username', 'resend', 'Standard Resend user'],
          ['SMTP Password', 're_****************', 'Resend API Key with Sending Access (Masked)']
        ]
      }
    ]
  },

  'security-redaction': {
    id: 'security-redaction',
    categoryId: 'cloud-security',
    title: 'Security & Secret Redaction Policy',
    subtitle: 'Information disclosure standards and secret masking protocols.',
    readTime: '4 min read',
    tags: ['Security', 'Redaction', 'Secrets', 'Compliance'],
    content: [
      {
        type: 'paragraph',
        text: 'In accordance with enterprise developer security guidelines (Stripe, AWS, Supabase), all Krasola technical documentation enforces a zero-secrets disclosure policy.'
      },
      {
        type: 'callout',
        variant: 'important',
        title: 'Information Classification Rules',
        text: 'Public documentation includes architectural DDLs, client-side configs, and math algorithms. All secret keys (service_role, SMTP passwords, JWT secrets, database connection passwords) are strictly masked or redacted.'
      },
      {
        type: 'table',
        headers: ['Asset Type', 'Classification', 'Treatment in Docs'],
        rows: [
          ['Architecture DDLs & Types', '🟢 Public', 'Full definition displayed'],
          ['Client Configs (anon_key, URL)', '🟢 Public', 'Shown with standard placeholders'],
          ['Private User PII / Emails', '🔴 Strictly Redacted', 'Replaced with generic developer mocks (e.g. user@example.com)'],
          ['Service Role Secret Keys', '🔴 Strictly Redacted', 'Never included or rendered in any documentation'],
          ['SMTP / API Auth Keys', '🟡 Masked', 'Masked notation: re_**************** or process.env.KEY']
        ]
      }
    ]
  },

  'notifications-engine': {
    id: 'notifications-engine',
    categoryId: 'platform-systems',
    title: 'Notification Center & 50-Item Ring Buffer',
    subtitle: 'Real-time database trigger that auto-prunes notifications beyond 50 entries.',
    readTime: '5 min read',
    tags: ['Notifications', 'Ring Buffer', 'PostgreSQL Trigger', 'Real-Time'],
    content: [
      {
        type: 'paragraph',
        text: 'The In-App Notification Center provides real-time feedback when assets are saved, quotas are reached, or security events occur. To prevent database bloating, it employs an automated PostgreSQL Ring Buffer trigger.'
      },
      {
        type: 'heading',
        level: 2,
        title: 'PostgreSQL Ring-Buffer Trigger Function'
      },
      {
        type: 'code',
        language: 'sql',
        title: 'Automatic 50-Item Ring Buffer Pruning Trigger',
        code: `CREATE OR REPLACE FUNCTION public.prune_user_notifications_ring_buffer()
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

CREATE TRIGGER tr_prune_user_notifications
AFTER INSERT ON public.user_notifications
FOR EACH ROW
EXECUTE FUNCTION public.prune_user_notifications_ring_buffer();`
      }
    ]
  },

  'version-control': {
    id: 'version-control',
    categoryId: 'platform-systems',
    title: 'Semantic Versioning & Release Lifecycle',
    subtitle: 'SemVer 2.0 principles, build-time injection, and live update checking.',
    readTime: '4 min read',
    tags: ['SemVer', 'Vite define', 'Release', 'Version'],
    content: [
      {
        type: 'paragraph',
        text: 'Krasola follows Semantic Versioning 2.0 (`MAJOR.MINOR.PATCH`). Compile-time global constants (`__APP_VERSION__`, `__COMMIT_HASH__`, `__BUILD_TIMESTAMP__`) are injected on every build via `vite.config.js`.'
      },
      {
        type: 'table',
        headers: ['SemVer Level', 'Example Shift', 'Criteria'],
        rows: [
          ['MAJOR (X.0.0)', '1.0.0 ➔ 2.0.0', 'Incompatible API changes, breaking database migrations.'],
          ['MINOR (1.Y.0)', '1.0.0 ➔ 1.1.0', 'New backward-compatible features (e.g. Notification Center).'],
          ['PATCH (1.1.Z)', '1.1.0 ➔ 1.1.1', 'Bug fixes, styling alignments, telemetry resilience.']
        ]
      }
    ]
  },

  'release-history': {
    id: 'release-history',
    categoryId: 'platform-systems',
    title: 'Platform Changelog & Release Lineage',
    subtitle: '100% genuine chronological record of all production releases and feature additions.',
    readTime: '4 min read',
    tags: ['Changelog', 'Releases', 'History', 'Lineage'],
    content: [
      {
        type: 'paragraph',
        text: 'Krasola maintains a strict, transparent release history conforming to SemVer 2.0 and Keep a Changelog specifications. Below is the historical catalog of all versions.'
      },
      {
        type: 'table',
        headers: ['Version', 'Type', 'Date', 'Key Deliverables'],
        rows: [
          ['v1.2.3', 'Patch', '2026-08-18', 'Fixed runtime Sun/Moon icon imports in App.jsx for mobile theme toggle.'],
          ['v1.2.2', 'Patch', '2026-08-18', 'Mobile-first navigation overhaul, 48px touch targets, bottom sheets, sub-tab carousels.'],
          ['v1.2.1', 'Patch', '2026-08-18', 'Automated release engine (scripts/auto-version.js) & light theme contrast polish.'],
          ['v1.2.0', 'Minor', '2026-08-18', 'Diátaxis Documentation Studio, Secrets Redaction, Ctrl+K search modal.'],
          ['v1.1.0', 'Minor', '2026-08-17', 'In-App Notification Center, 50-item PG ring buffer, SemVer diagnostics, HTML email suite.'],
          ['v1.0.0', 'Major', '2026-08-14', 'Initial production release: Palette Lab, Pattern Studio (1,024 presets), Icon Finder, Cloud Vault, PWA.']
        ]
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Interactive Release Explorer',
        text: 'You can also browse, filter, search, and copy commit SHAs interactively by navigating to Settings Studio ➔ System Diagnostics ➔ "View Changelog & Releases".'
      }
    ]
  },

  'keyboard-shortcuts': {
    id: 'keyboard-shortcuts',
    categoryId: 'platform-systems',
    title: 'Keyboard Shortcuts & Hotkeys Matrix',
    subtitle: 'Boost creator productivity with quick keyboard commands.',
    readTime: '2 min read',
    tags: ['Shortcuts', 'Hotkeys', 'Productivity'],
    content: [
      {
        type: 'table',
        headers: ['Key Combination', 'Studio Scope', 'Action Triggered'],
        rows: [
          ['Space', 'Palette Lab', 'Randomize & generate new color harmony palette'],
          ['Ctrl + K / Cmd + K', 'Global', 'Open Documentation Search Command Palette'],
          ['Ctrl + S / Cmd + S', 'Palette / Pattern', 'Open Save Asset Modal'],
          ['1 .. 5', 'Palette Lab', 'Toggle lock on individual color column slot'],
          ['Esc', 'Modals / Drawer', 'Close active modal, drawer, or search dialog']
        ]
      }
    ]
  }
};
