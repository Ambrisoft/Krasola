# Research Report: Adobe Color Image Picker & Interactive Pin Marker Engine

> **DOCUMENT CONTROL**:
> - **Category**: Technology & Algorithmic Research Report
> - **Location**: `docs/research/adobe_image_color_picker_research_report.md`
> - **Status**: Immutable Baseline Document
> - **Author**: Antigravity AI (Google DeepMind Team)

---

## 1. Problem Definition & Architectural Audit

In the previous extraction implementation of **Extractor Studio** (`PaletteExtractor.jsx`):
1. **Faded Image & Text Overlay**: Uploading an image displayed a faded low-opacity background (`opacity-30`) with permanent upload instructions overlaid across the image.
2. **Lack of Pin Marker Interactivity**: Adobe Color allows users to see and drag circular color pin markers directly on top of the image to pick custom colors.
3. **Preset Discrepancy**: The extraction mood presets did not match Adobe Color's exact mood options (*Colorful*, *Bright*, *Muted*, *Deep*, *Dark*, *None*).

---

## 2. Adobe Color Architectural Specification

Adobe Color's image extraction platform operates on **2 Core UX Systems**:

### 2.1 Interactive Spatial Pin Markers
- **Full-Opacity Clean Image**: Upon uploading an image, all text overlays and upload icons disappear. The image renders at 100% opacity (`object-contain`).
- **$N$ Relative Percentage Markers**: $N$ circular pin markers are overlaid on top of the image container using percentage coordinates $(x\%, y\%)$.
- **Live Canvas Sampling**: Dragging marker $i$ calculates its relative coordinate $(x, y)$ on the image bounding box, reads pixel data $(R, G, B)$ from an HTML5 canvas buffer, and updates swatch $i$ in real-time.

### 2.2 MMCQ Coordinate Extraction Engine
When an image is loaded or mood is changed:
1. **MMCQ Box Subdivision**: Subdivision of RGB pixel space into $K$ clusters.
2. **Coordinate Mapping**: Each cluster box records the average $(X\%, Y\%)$ image coordinate of its contributing pixels.
3. **Adobe Mood Filtering**:
   - `colorful`: Filters for maximum saturation ($S \ge 0.45$).
   - `bright`: Filters for high lightness and saturation ($L \ge 0.65, S \ge 0.40$).
   - `muted`: Filters for soft desaturated tones ($S \le 0.40$).
   - `deep`: Filters for rich dark-mid tones ($L \le 0.45$).
   - `dark`: Filters for dark shadow tones ($L \le 0.30$).
   - `none`: Even grid distribution across image center.

---

## 3. Implementation Blueprint

1. Implement `extractMMCQWithCoordinates` in `src/utils/colorUtils.js`.
2. Upgrade `PaletteExtractor.jsx` to render interactive draggable markers over a clean 100% opacity image.
3. Implement pointer/touch move handlers to update swatches in real-time as markers are dragged over the image.
