# UI Design Specification — South Park Episode Generator

Generated from design audit of the live app at https://soushi888.github.io/southpark-episode-generator/

## Implementation Priority

| Priority | Change | Effort |
|----------|--------|--------|
| 🔴 High | Two-column desktop layout (sticky left panel) | Medium |
| 🔴 High | Card yellow left accent + shadow + depth | Small |
| 🔴 High | Sticky season headers in episode list | Small |
| 🔴 High | Custom CSS slider thumbs (visible, grabbable) | Small |
| 🟡 Medium | Season jump chips at top of list | Medium |
| 🟡 Medium | Repeat spin CTA inside empty state card | Small |
| 🟡 Medium | Row hover: yellow tint + left translate | Small |
| 🟡 Medium | Mark as seen/unseen toggle inside episode card | Small |
| 🟢 Low | Noise texture overlay on body background | Small |
| 🟢 Low | Seen episodes: muted text + strikethrough in list | Small |

---

## 1. Layout — Two-column on Desktop

**Breakpoint:** `lg` (1024px+) — `grid-cols-[1fr_1fr]`

```
┌──────────────────────────────────────────────────────┐
│               🏔 SOUTH PARK  (header, full width)    │
├────────────────────────┬─────────────────────────────┤
│  LEFT PANEL (sticky)   │  RIGHT PANEL (scrollable)   │
│  ─────────────────     │  ─────────────────────────  │
│  🎲 Random Episode     │  ▶ FILTERS                  │
│                        │    Season 1–28              │
│  ┌──────────────────┐  │    Tags · Characters        │
│  │   Episode Card   │  │  ─────────────────────────  │
│  │  (or empty state)│  │  All Episodes — 329 total   │
│  └──────────────────┘  │   SEASON 1  · 13 episodes  │
│                        │   · S01E01 Cartman...       │
└────────────────────────┴─────────────────────────────┘
```

- Left panel: `position: sticky; top: 2rem; height: fit-content`
- Right panel: `overflow-y: auto` with internal scroll

---

## 2. Episode Card

**Anatomy:**
```
┌─ yellow left accent bar (border-l-4 border-sp-yellow) ──┐
│  S16E03  ·  Oct 3, 2012                       [Share]   │
│                                                          │
│  FAITH HILLING            (sp-heading text-3xl)          │
│  ★★★★☆  8.2/10                                          │
│                                                          │
│  Stan, Kyle, Cartman, Kenny attempt to...                │
│                                                          │
│  [classic]  [season-finale]                             │
│                                                          │
│  ▶ WATCH NOW              [✓ Mark as seen]              │
└──────────────────────────────────────────────────────────┘
```

**CSS changes:**
- `border-l-4 border-sp-yellow` — yellow left stripe
- `bg-white/8 backdrop-blur-md` — lighter card surface
- `shadow-xl shadow-black/40` — clear depth
- Watch button: `w-full text-xl` Bangers, bottom of card
- Mark seen: ghost button, right-aligned in footer row

---

## 3. Empty State

```
┌──────────────────────────────────┐
│   🎲  (animate-bounce, slow)     │
│                                  │
│   Spin the wheel                 │
│   329 episodes across 28 seasons │
│   ready to be discovered         │
│                                  │
│   [🎲 Pick an Episode]  ← CTA   │
└──────────────────────────────────┘
```

- Text: `text-white/50` (up from `text-white/30`)
- Repeat spin CTA button so user doesn't scroll back up

---

## 4. Episode List

**a) Sticky season headers:**
- `position: sticky; top: 0; z-index: 10`
- Background: `bg-sp-darker` so content slides behind
- Format: `SEASON 1  ·  13 episodes`

**b) Season jump chips at top of list:**
```
Jump to: [S01] [S05] [S10] [S15] [S20] [S25] [S28]
```
- Click scrolls to that season header via `scrollIntoView({ behavior: 'smooth' })`
- Show only milestone seasons (1, 5, 10, 15, 20, 25, 28)

**c) Row design:**
- Alternating: `even:bg-white/3`
- Hover: `hover:bg-sp-yellow/8 hover:translate-x-1 transition-all`
- Active: `bg-sp-yellow/15 border-l-2 border-sp-yellow`
- Seen: `text-white/40 line-through` on title, `✓` checkmark right side

**d) Performance:** add `content-visibility: auto` on each row via CSS

---

## 5. Filter Panel

**a) Toggle triangle:** ensure `rotate-90` on open has `transition-transform duration-200`

**b) Custom range slider CSS** (in `app.css`):
```css
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.1);
  outline: none;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #FFC20E;
  border: 3px solid #000;
  cursor: grab;
}
input[type='range']::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #FFC20E;
  border: 3px solid #000;
  cursor: grab;
}
```

**c) Tag pills:** selected state uses Bangers font (`font-sp`) for stronger contrast with unselected (Nunito).

**d) Section headers:** `text-white/60 text-sm` (up from `text-white/40 text-xs`)

---

## 6. Color & Typography Refinements

| Element | Current | Proposed |
|---------|---------|----------|
| Card background | `bg-white/5` | `bg-white/8 shadow-xl` |
| List row hover | `bg-white/5` | `bg-sp-yellow/8 + translate-x-1` |
| Empty state text | `text-white/30` | `text-white/50` |
| Filter section labels | `text-white/40 text-xs` | `text-white/60 text-sm` |
| Season headers | `text-sp-yellow text-sm` | `text-sp-yellow text-base` + episode count |
| Watch button | inline, left | `w-full text-xl` |

---

## 7. CI Build Fix

Ensure base path resolves correctly in the GitHub Actions workflow:

```yaml
- name: Build
  run: NODE_ENV=production bun run build
```

(Vite sets this automatically, but making it explicit guarantees the `svelte.config.js` base path condition evaluates correctly.)
