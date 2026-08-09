# Investigation Report: Canvas Studio "Inspire Me" Palette Coupling Bug

> **DOCUMENT CONTROL**:
> - **Category**: Bug Investigation & Algorithmic Analysis Report
> - **Location**: `docs/investigation/canvas_studio_inspire_me_investigation_report.md`
> - **Status**: Immutable Baseline Document
> - **Author**: Antigravity AI (Google DeepMind Team)

---

## 1. Problem Identification & Empirical Traceback

In **Pattern Studio: Canvas Studio** (`PatternStudio.jsx` & `PatternGenerator.jsx`), clicking the **"Inspire Me"** button caused a state coupling bug:

```javascript
// Flawed Implementation (Lines 106-111):
if (activePalette.length >= 3) {
  const shuffled = [...activePalette].sort(() => 0.5 - Math.random());
  setBg(shuffled[0]);
  setColor1(shuffled[1]);
  setColor2(shuffled[2]);
}
```

### Empirical Flaw:
- Whenever an active palette was loaded in Palette Lab, clicking "Inspire Me" recycled the active palette colors instead of inspiring the user with fresh, creative color combinations and novel pattern themes.

---

## 2. Industry Standard: Decoupled Inspiration Engine

Top pattern generation platforms (MagicPattern, Pattern Monster, SVGBackgrounds) decouple randomization from project palette state:

1. **Fresh Harmonized Randomization (Default)**: "Inspire Me" generates a dynamic harmonized HSL color triad ($BG, C_1, C_2$) across the 360° color wheel.
2. **Explicit Palette Lock Option**: Adds a **"Lock Active Palette"** toggle switch so users can explicitly choose whether "Inspire Me" rolls fresh colors or shuffles within their active palette.

---

## 3. Resolution Plan

1. Update `handleInspireMe` in `PatternStudio.jsx` to generate fresh harmonized HSL color triads by default.
2. Add `keepActivePaletteLinked` toggle state.
3. Add aspect ratio presets and live color swap controls to `PatternGenerator.jsx`.
