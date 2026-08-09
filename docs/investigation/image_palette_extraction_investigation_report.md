# Investigation Report: Image Color Palette Extraction Algorithms & Adobe-Grade MMCQ Engine

> **DOCUMENT CONTROL**:
> - **Category**: Algorithmic & UX Investigation Report
> - **Location**: `docs/investigation/image_palette_extraction_investigation_report.md`
> - **Status**: Immutable Baseline Document
> - **Author**: Antigravity AI (Google DeepMind Team)

---

## 1. Problem Identification & Empirical Audit

In **Palette Lab: Extractor Studio** (`PaletteExtractor.jsx`), the current extraction algorithm uses naive RGB frequency binning:

```javascript
// Current Flawed Implementation (Lines 50-66):
const qr = Math.round(r / 16) * 16;
const qg = Math.round(g / 16) * 16;
const qb = Math.round(b / 16) * 16;
const key = `${qr},${qg},${qb}`;
colorFrequency[key] = (colorFrequency[key] || 0) + 1;

const sortedColors = Object.keys(colorFrequency)
  .sort((a, b) => colorFrequency[b] - colorFrequency[a]);
```

### Empirical Flaw:
- In complex artwork (e.g., vibrant double-exposure owl graphics), dark background or shadow pixels dominate the raw pixel frequency count.
- As a result, the top $N$ frequency bins return near-identical dark gray/black colors (`#101010`, `#102020`, `#202020`, `#101020`, `#201010`), completely ignoring the vibrant focal colors (golds, teals, pinks, oranges) of the image.

---

## 2. Industry Benchmark: Adobe Color & MMCQ Extraction Engine

Leading platforms (Adobe Color, Coolors, Material Design 3) extract accurate palettes using **3 Core Principles**:

### 2.1 Modified Median Cut Quantization (MMCQ)
- **3D Color Box Subdivision**: Sampled pixels are mapped into a 3D RGB bounding box.
- The box with the greatest color range along R, G, or B is recursively bisected at the median pixel until $K$ target cluster boxes are formed.
- The weighted average of each cluster box produces the representative color.

### 2.2 Adobe Extraction Mood Modes
Adobe Color provides 5 extraction modes to tailor color selection:
1. **Vibrant / Dominant (Default)**: Boosts saturated, eye-catching hues while filtering out mud/background noise.
2. **Colorful**: Filters for maximum saturation ($S \ge 35\%$).
3. **Muted**: Filters for soft pastel tones ($20\% \le L \le 80\%$).
4. **Deep**: Extracts rich dark shadow tones ($L \le 40\%$).
5. **Light**: Extracts bright highlight tones ($L \ge 75\%$).

### 2.3 Perceptual Distance ($\Delta E$) & Luminance Filtering
- Filters out near-black (`luminance < 0.08`) and near-white (`luminance > 0.95`) background noise unless in Deep/Light mode.
- Enforces a minimum perceptual distance ($\Delta E > 15.0$) between extracted swatches so all $N$ colors are visually distinct.

---

## 3. Implementation Plan Overview

1. Create a dedicated MMCQ color extraction engine (`extractPaletteFromImage`) in `src/utils/colorUtils.js`.
2. Upgrade `PaletteExtractor.jsx` to include Adobe Extraction Mood selection (*Vibrant*, *Colorful*, *Muted*, *Deep*, *Light*).
3. Connect the $N$-color slider ($N \in [2, 10]$) directly to the MMCQ engine for instant real-time re-extraction.
