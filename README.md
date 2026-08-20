# Krasola — Multi-Utility Creative Workspace

<div align="center">

![Krasola Banner](public/favicon.svg)

[![Release](https://img.shields.io/github/v/release/Ambrisoft/Krasola?style=flat-square&color=6366f1)](https://github.com/Ambrisoft/Krasola/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-emerald.svg?style=flat-square)](https://web.dev/progressive-web-apps/)

**An ultra-fast, client-first design studio and prototyping workspace.**  
Generate harmonious color schemes, procedural SVG patterns, customize 1,000+ vector icons, process canvas photos, and sync assets directly in browser sandboxes.

[Explore Live Workspace](https://krasola.ambrisoft.com) · [Changelog](CHANGELOG.md) · [Report Bug](.github/ISSUE_TEMPLATE/bug_report.md) · [Request Feature](.github/ISSUE_TEMPLATE/feature_request.md)

</div>

---

## ✨ Features & Integrated Studios

- 🎨 **Palette Lab**: Generate mathematically verified color harmonies (*Monochromatic*, *Analogous*, *Complementary*, *Triadic*, *Tetradic*, *Split-Complementary*) with real-time **WCAG 2.1 AA/AAA contrast verification**.
- 📐 **Pattern Studio**: 16 procedural vector pattern formulas (*Isometric Cubes*, *Bézier Waves*, *Hexagons*, *Tech Grid*, *Polka Dots*) with instant inline SVG DataURI export.
- ⚡ **Icon Finder**: Search and customize 1,000+ Lucide vector icons with live stroke width, pixel sizing, active palette tinting, and 1-click React JSX export.
- 🖼️ **Image Studio**: 60fps client-side HTML5 canvas filters, dominant 5-color palette extraction, and WebP compression.
- ☁️ **Cloud Vault**: Dual-storage engine supporting offline LocalStorage persistence and authenticated Supabase PostgreSQL cloud sync.
- ⌨️ **Command Palette**: Universal `Ctrl + K` / `Cmd + K` navigation across all studios, themes, and actions.
- 📱 **Mobile-First PWA**: Installable standalone application with offline service worker caching, 48px touch targets, and automatic update alerts.
- 🎭 **16 Curated Themes**: Instant theme switching powered by CSS Custom Property token architecture.

---

## 🚀 Quickstart

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** / **pnpm** / **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ambrisoft/Krasola.git
   cd Krasola
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *(Krasola runs in full offline sandbox mode without Supabase credentials. Add Supabase URL and Anon Key only if you wish to enable authenticated cloud sync).*

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Scripts & Release Engineering

| Script | Command | Description |
|---|---|---|
| **Development** | `npm run dev` | Starts Vite local development server. |
| **Production Build** | `npm run build` | Compiles optimized production bundle in `dist/`. |
| **Preview** | `npm run preview` | Previews production build locally. |
| **Patch Release** | `npm run release:patch` | Bumps SemVer patch `0.0.X`, synchronizes PWA cache, and builds. |
| **Minor Release** | `npm run release:minor` | Bumps SemVer minor `0.X.0` for new features. |

---

## 🏗️ Architecture & Tech Stack

- **Frontend Core**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling & Tokens**: [Tailwind CSS](https://tailwindcss.com/) + CSS Custom Properties (`--app-bg`, `--app-accent`)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Backend & Cloud Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **PWA & Caching**: Custom Service Worker (`sw.js`) with cache busting & update listener

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Please review our [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before submitting pull requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🔒 Security

For security vulnerabilities and responsible disclosure, please refer to [SECURITY.md](SECURITY.md).

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

<div align="center">
  <sub>Crafted with pride by <a href="https://ambrisoft.com">Ambrisoft Technologies</a></sub>
</div>
