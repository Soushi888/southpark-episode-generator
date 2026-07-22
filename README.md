# South Park Random Episode Picker

A static SPA that picks a random South Park episode from all 329 episodes across 28 seasons. Filter by season range, characters, and tags. Seen episodes are tracked in `localStorage`.

**Live:** https://soushi888.github.io/southpark-episode-picker/

## Features

- Random episode picker (uniform random index across the filtered pool)
- Filter by season range, featured characters, and episode tags
- Seen-episode tracking with localStorage persistence and in-card toggle
- Shareable URLs that restore the current episode and all filters
- Two-column layout on desktop — sticky picker/card, scrollable episode list
- Season jump navigation and sticky season headers in the episode list
- Space/Enter keyboard shortcut to spin
- South Park design: Bangers font, mountain SVG backdrop, sp-yellow/red palette

## Development

```bash
bun install
bun run dev        # http://localhost:5173
```

## Building

```bash
NODE_ENV=production bun run build  # output → build/
bun run preview                    # preview locally
```

## Testing

```bash
bun run test          # unit tests (vitest)
bun run test:watch    # watch mode
bun run test:e2e      # Playwright e2e (requires dev server on :5173)
```

## Updating Episode Data

```bash
bun run scrape
```

Scrapes all 28 seasons from the Wikipedia API and overwrites `src/lib/data/episodes.json`. Character lists and IMDB ratings must be filled in manually after scraping.

## Deployment

Deploys automatically to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev) with `adapter-static` — Svelte 5 runes throughout
- [UnoCSS](https://unocss.dev) — Tailwind-compatible utilities + custom SP theme
- [Vite 6](https://vitejs.dev)
- [Biome](https://biomejs.dev) — linting and formatting
- [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) — unit and e2e tests
