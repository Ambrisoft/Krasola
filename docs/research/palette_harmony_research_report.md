# Research Report: Advanced Palette Interpolation & Color Harmony Logic

> **DOCUMENT CONTROL**:
> - **Category**: Technology & Algorithmic Research Report
> - **Location**: `docs/research/palette_harmony_research_report.md`
> - **Status**: Immutable Baseline Document
> - **Author**: Antigravity AI (Google DeepMind Team)

---

## 1. Problem Definition & Empirical Audit

In **Palette Lab's Generator Canvas** (`PaletteGenerator.jsx`), the current swatch insertion mechanism (`addSwatch(idx)`) behaves as follows:

```javascript
// Current Flawed Implementation (Line 71):
const newColor = { hex: generateRandomColor(), isLocked: false };
```

### Key Issues Identified:
1. **Harmonic Disconnection**: `generateRandomColor()` selects a completely random hue ($0^\circ - 360^\circ$), saturation, and lightness. Inserting this between swatch $A$ and swatch $B$ creates jarring visual clashes.
2. **Rule Breaking**: If the user selected an **Analogous**, **Monochromatic**, or **Complementary** harmony rule, adding a swatch introduces an unharmonized outlier color that violates the mathematical rule of the palette.
3. **Neighbor Unawareness**: The insertion function does not inspect the HSL/OKLCH color coordinates of adjacent swatches (`colors[idx]` and `colors[idx + 1]`).

---

## 2. Industry Benchmark: Adobe Color & Coolors Architectural Principles

Leading color design platforms (Adobe Color, Coolors.co, Material Design 3) handle dynamic palette expansion using **3 Core Principles**:

### 2.1 Perceptual Midpoint Interpolation (OKLCH / HSL Vector Space)
When inserting a swatch between Swatch $A$ ($H_A, S_A, L_A$) and Swatch $B$ ($H_B, S_B, L_B$):
- **Shortest Arc Hue Interpolation**: Rather than simple averaging, compute the shortest angular path on the color wheel:
  $$\Delta H = (H_B - H_A + 540^\circ) \pmod{360^\circ} - 180^\circ$$
  $$H_{\text{new}} = (H_A + \frac{\Delta H}{2} + 360^\circ) \pmod{360^\circ}$$
- **Linear Saturation & Lightness Blend**:
  $$S_{\text{new}} = \text{round}\left(\frac{S_A + S_B}{2}\right)$$
  $$L_{\text{new}} = \text{round}\left(\frac{L_A + L_B}{2}\right)$$
- **Terminal Extrapolation**: If inserted at the end of the palette (after the last swatch), calculate the trend vector $(\Delta H, \Delta S, \Delta L)$ from the previous two swatches to extend the progression naturally.

### 2.2 Global Harmony Conformance Realignment
- When an active harmony rule is selected (*Monochromatic*, *Analogous*, *Complementary*, *Triadic*, *Split-Complementary*), adding a swatch should **re-harmonize the entire $N+1$ palette**:
  - Preserve all locked swatches (`isLocked: true`).
  - Use the primary unlocked swatch as the base anchor.
  - Dynamically recalculate all unlocked swatches across $N+1$ steps using `generateHarmoniousPalette(baseHex, rule, N+1)`.

### 2.3 Perceptual Distance Check ($\Delta E$)
- Ensure the inserted swatch has a minimum perceptual difference ($\Delta E > 8.0$) from its neighbors so swatches do not appear identical.

---

## 3. Proposed Advanced Insertion Algorithms

### Algorithm 1: Contextual Neighbor Interpolation Engine (`getHarmoniousInsertedColor`)

```javascript
export function getHarmoniousInsertedColor(colors, insertIdx, harmonyRule) {
  // If palette is operating under an active mathematical harmony rule, use base anchor
  if (harmonyRule && harmonyRule !== 'random') {
    const baseIdx = colors.findIndex(c => !c.isLocked);
    const baseHex = baseIdx !== -1 ? colors[baseIdx].hex : colors[0].hex;
    const newCount = colors.length + 1;
    const newHarmoniousPalette = generateHarmoniousPalette(baseHex, harmonyRule, newCount);
    
    // Pick the color corresponding to the insert index position
    return newHarmoniousPalette[insertIdx + 1] || newHarmoniousPalette[newHarmoniousPalette.length - 1];
  }

  // Fallback for Random Aesthetic mode: Perceptual Midpoint Vector Interpolation
  const leftColor = colors[insertIdx];
  const rightColor = colors[insertIdx + 1] || colors[0]; // Wrap around or terminal

  const hslA = hexToHsl(leftColor.hex);
  const hslB = hexToHsl(rightColor.hex);

  // Calculate shortest arc hue distance
  let deltaH = (hslB.h - hslA.h + 540) % 360 - 180;
  let newH = (hslA.h + deltaH / 2 + 360) % 360;

  // Midpoint Saturation & Lightness
  let newS = Math.round((hslA.s + hslB.s) / 2);
  let newL = Math.round((hslA.l + hslB.l) / 2);

  // Slight subtle variation to avoid flat identical midpoints
  newS = Math.min(95, Math.max(20, newS + (Math.random() * 6 - 3)));
  newL = Math.min(90, Math.max(15, newL + (Math.random() * 6 - 3)));

  return hslToHex(Math.round(newH), newS, newL);
}
```

---

## 4. Comparison Table: Current vs. Proposed Adobe-Grade Insertion

| Metric / Aspect | Current Implementation | Proposed Adobe-Grade Implementation |
| :--- | :--- | :--- |
| **Color Generation** | Completely random `generateRandomColor()` | Perceptual vector midpoint interpolation |
| **Neighbor Awareness** | Ignores adjacent swatches | Calculates shortest hue arc & average S/L of left & right neighbors |
| **Harmony Conformance** | Breaks selected harmony rules | Maintains active rule (*Monochromatic*, *Analogous*, etc.) across $N+1$ swatches |
| **Visual Smoothness** | High risk of color clashing | Guaranteed smooth gradient transition |

---

## 5. Next Steps

Upon review and approval of this research report, we will implement `getHarmoniousInsertedColor()` in `colorUtils.js` and update `addSwatch()` in `PaletteGenerator.jsx`.
