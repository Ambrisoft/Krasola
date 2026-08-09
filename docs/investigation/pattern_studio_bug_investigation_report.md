# Bug Investigation Report: Pattern Studio Palette Coupling & Import State Bug

> **DOCUMENT CONTROL**:
> - **Category**: Bug Investigation & Diagnostic Traceback
> - **Location**: `docs/investigation/pattern_studio_bug_investigation_report.md`
> - **Status**: Immutable Baseline Document
> - **Author**: Antigravity AI (Google DeepMind Team)

---

## 1. Bug Summary & Empirical Findings

In **Pattern Studio** (`src/components/PatternStudio.jsx`), an architectural bug was identified where all pattern templates in the **Templates Gallery** (`PatternExplorer.jsx`) automatically inherited and rendered the active global palette from **Palette Lab**, even before or without the user clicking the **"Import Active Palette Colors"** button.

### Observed Flaw:
- Browsing the Templates Gallery showed all template thumbnails rendered in identical colors derived from `activePalette`.
- The **"Import Active Palette Colors"** button on the Palette Connector page appeared redundant because the active palette was already force-applied everywhere.

---

## 2. Root Cause Traceback

Inspection of `PatternStudio.jsx` and `PatternExplorer.jsx` revealed:

```javascript
// Flawed State Propagation in PatternExplorer.jsx (Lines 24-28):
{Object.entries(patternTypes).map(([key, value]) => {
  // Using global studio bg, color1, color2 props directly:
  const innerSvg = value.svg(30, 30, 0.95, 1.5, color1, color2, bg);
  ...
```

1. **Shared Single State**: `bg`, `color1`, `color2` state in `PatternStudio.jsx` was initialized directly from `activePalette[0]`, `activePalette[1]`, `activePalette[2]` on component mount.
2. **Missing Decoupled Default State**: Pattern templates lacked dedicated preset default color properties (`defaultBg`, `defaultColor1`, `defaultColor2`).
3. **Missing Import Flag**: There was no `isPaletteImported` boolean flag to distinguish between **Default Aesthetic Preset Mode** and **Palette Lab Connected Mode**.

---

## 3. Resolution Blueprint

1. **Default Preset Colors**: Assign curated default colors (`defaultBg`, `defaultColor1`, `defaultColor2`) to each template in `PATTERN_TYPES`.
2. **Decoupled Templates Gallery**: `PatternExplorer.jsx` renders thumbnails using each template's curated default colors when `isPaletteImported` is `false`.
3. **Explicit Import Trigger**: Clicking **"Import Active Palette Colors"** sets `isPaletteImported = true` and updates `bg`, `color1`, `color2` in Canvas Studio and Palette Connector.
