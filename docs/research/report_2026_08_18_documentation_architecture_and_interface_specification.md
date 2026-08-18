# Documentation Interface Architecture & Technical Specifications

## 1. Executive Summary
World-class developer platforms (e.g., Stripe, Supabase, Vercel, Tailwind CSS, Linear) treat documentation as a core product interface rather than a secondary help manual. High-performing documentation interfaces minimize "time to first success," provide interactive code execution, maintain instant global search, and guarantee 100% factual accuracy with active production code.

This document outlines the architectural research, UX patterns, the Diátaxis framework typology, and the exact implementation specifications for **Krasola Documentation Studio**.

---

## 2. Industry Architecture & UX Patterns

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Documentation Interface                                │
├───────────────────────┬────────────────────────────────────────┬───────────────────────┤
│    Sidebar Navigation │        Interactive Reader Area         │     On This Page      │
│  • Category Tree      │  • Breadcrumbs & Header                │  • Section Anchors    │
│  • Search Filter      │  • Content & Mathematical Formulas     │  • Active Scroll Spy  │
│  • Studio Badges      │  • Copyable Code Blocks                │  • Feedback & GitHub  │
│  • Status Indicators  │  • Callout Alerts & Tables             │    Edit Links         │
└───────────────────────┴────────────────────────────────────────┴───────────────────────┘
```

### A. The Diátaxis Information Architecture
Modern developer documentation is categorized into four distinct modes:
1. **Tutorials (Learning-Oriented):** End-to-end quickstart guides (e.g., "Creating and Exporting Your First Palette in 60 Seconds").
2. **How-To Guides (Task-Oriented):** Step-by-step workflows (e.g., "Connecting Custom SMTP to Supabase Auth", "Exporting SVG Patterns to React").
3. **Reference (Information-Oriented):** 100% accurate technical specifications (e.g., PostgreSQL table schemas, RLS security policies, WCAG 2.1 contrast formulas, SemVer build flags).
4. **Explanation (Understanding-Oriented):** Architecture deep dives (e.g., "How the 50-item PostgreSQL Ring Buffer Works", "Why Canvas WebP Compression Beats JPEG").

### B. Core UX Elements of Top Documentation Portals
* **Instant Command Palette (`Ctrl + K` / `Cmd + K`):** Real-time client-side search indexing sections, topics, keywords, and code examples.
* **1-Click Copy Code Blocks:** Syntax-highlighted blocks with language badges, copy confirmations, and inline parameter notes.
* **Visual Callouts:** Distinct color-coded notes (`Note`, `Tip`, `Important`, `Warning`, `Security`).
* **Active ScrollSpy:** Dynamic table of contents highlighting the current section as the user scrolls.
* **Auto Light / Dark Theme Sync:** Flawless visual adaptation matching user OS and app theme.

---

## 3. Strict Factual Accuracy & Anti-Hallucination Policy

> [!IMPORTANT]
> **Strict Documentation Integrity Rule**:
> Krasola documentation contains **ZERO fake, mock, or placeholder information**. All documentation pages directly reflect the live codebase, exact database tables, exact security policies, and mathematical algorithms implemented in the project.

### Core Factual Assets Documented:
1. **Palette Lab**: HSL manipulation, WCAG 2.1 Relative Luminance ($L = 0.2126R + 0.7152G + 0.0722B$), Contrast Ratio ($CR = \frac{L_1 + 0.05}{L_2 + 0.05}$), Color Harmonies (Analogous, Monochromatic, Triadic, Tetradic, Complementary), and Multi-Format Exports (CSS, Tailwind, SCSS, JSON).
2. **Pattern Studio**: Vector SVG geometry algorithms (Isometric Grid, Polka Dots, Waves, Chevron, Topographic Curves, Memphis, Geometric Matrix), Bézier curve math, and PNG/SVG rendering pipelines.
3. **Image Studio**: Unsplash API integration, client-side Canvas WebP/JPEG lossy & lossless compression engine, dynamic palette extraction via color quantization.
4. **Cloud Vault & Database Schemas**: Full table specifications for `profiles`, `platform_palettes`, `community_palettes`, `platform_patterns`, `community_patterns`, `user_images`, `user_storage_quotas`, and `user_notifications`.
5. **Security & RLS**: PostgreSQL Row Level Security policies with `auth.uid() = user_id` isolation.
6. **In-App Notification Center**: Real-time Supabase sync, 50-item ring buffer trigger (`tr_prune_user_notifications`), and offline fallback.
7. **Version Control & PWA**: SemVer 2.0, `__APP_VERSION__`, `__COMMIT_HASH__`, `/version.json`, and Service Worker cache lifecycle.

---

## 4. Technical Implementation Specification

### A. Component Structure
* **`src/components/Documentation.jsx`**: Main documentation interface with split sidebar, content reader, table of contents, and quick search.
* **`src/data/docsContent.js`**: Structured, type-safe documentation data store organized into modular categories with search keywords, code samples, tables, and callouts.
* **`src/components/docs/DocsSearchModal.jsx`**: `Ctrl + K` global documentation search dialog.
* **`src/components/docs/DocsCodeBlock.jsx`**: Reusable copyable code snippet component.

### B. Navigation Tree Structure
1. **Getting Started**
   * Overview & Core Philosophy
   * Architecture & Technology Stack
   * PWA Standalone Installation
2. **Creative Studios**
   * Palette Lab & Color Science (WCAG 2.1)
   * Pattern Studio & SVG Geometry
   * Image Search & Canvas Compression
   * Lucide Vector Icon Suite
3. **Cloud & Security**
   * Cloud Vault & 50MB Storage Quota
   * Supabase PostgreSQL Database Schemas
   * Row Level Security (RLS) Policies
   * Authentication & Custom SMTP Delivery
4. **Platform Systems**
   * In-App Notification Center & 50-Item Ring Buffer
   * Semantic Versioning 2.0 & Release Lifecycle
   * Keyboard Shortcuts & Hotkeys Reference
