# Research Report: Dynamic Palette Visualizer Architecture & Multi-Domain Preview Engine

> **DOCUMENT CONTROL**:
> - **Category**: Technology & Algorithmic Research Report
> - **Location**: `docs/research/palette_visualizer_research_report.md`
> - **Status**: Immutable Baseline Document
> - **Author**: Antigravity AI (Google DeepMind Team)

---

## 1. Problem Statement & Auditing

In **Palette Lab: Visualizer Arena** (`PaletteVisualizer.jsx`), the current implementation renders only 3 static mock cards (SaaS Dashboard, Mobile App, Landing Page).

### Deficiencies:
1. **Limited Preview Diversity**: Missing dedicated views for Data Visualization, E-Commerce, Typography & Component Design System.
2. **Fixed 5-Swatch Mapping**: Hardcoded fallback values (`c0`, `c1`, `c2`, `c3`, `c4`) that fail to scale when palettes have $N = 2 \rightarrow 12$ swatches.
3. **Static Dark/Light Global State**: Lacks real-time category filtering and interactive component state toggling.

---

## 2. Industry Benchmark: Realtime Colors, Coolors & Material Design 3

Top platform visualizers employ **2 Architectural Systems**:

### 2.1 Dynamic $N$-Swatch Component Mapping Algorithm (`getPaletteRoleMapping`)
Maps variable length palettes ($N \in [2, 12]$) to standard UI roles:
- **Primary ($C_1$)**: Main brand identity color (Hero CTA, primary button background, active tab line).
- **Secondary ($C_2$)**: Secondary actions, progress meters, badge highlights.
- **Accent / Tertiary ($C_3$)**: Status pills, notification dots, icon backgrounds.
- **Extended Swatches ($C_4 \dots C_{12}$)**: Sequential series mapping for multi-bar charts, donut graphs, and variant swatches.
- **Dynamic Contrast Text ($FG$)**: WCAG 2.1 contrast calculation guaranteeing text legibility over any swatch background tone.

### 2.2 The 6 Essential Preview Domains
1. **SaaS Analytics Dashboard**: Key metrics, multi-series progress bars, data table badges, active status pills.
2. **Mobile App UI Suite**: Smartphone mockup, navigation bar, chat bubbles, action cards.
3. **Modern Landing Page Hero**: Hero typography, dual CTA buttons, feature card grid, badge callout.
4. **Data Visualization Arena**: Donut chart, bar chart, area graph, KPI cards, legend indicators.
5. **E-Commerce & Product Showcase**: Product preview card, price badge, rating stars, color selector swatches, Add to Cart CTA.
6. **Design System & Component Matrix**: Typography scale (H1-Body), solid swatch chips, button component matrix (Default, Hover, Active, Disabled).

---

## 3. Implementation Plan Overview

1. Build `getPaletteRoleMapping` in `src/utils/colorUtils.js` for dynamic $N$-swatch UI role assignment.
2. Upgrade `PaletteVisualizer.jsx` with a Category Tab Selector (*All Previews*, *SaaS Dashboard*, *Mobile App*, *Landing Page*, *Data Charts*, *E-Commerce*, *Design System*).
3. Implement all 6 interactive preview cards with Light/Dark UI mode support.
