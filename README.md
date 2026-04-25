# South Park Random Episode Generator

A static SPA that picks a random South Park episode with optional filters for seasons, characters, and episode tags. Results are weighted by IMDB rating so higher-rated episodes surface more often. Seen episodes are tracked in `localStorage` and can be excluded from future picks.

## Features

- Weighted random selection based on IMDB ratings
- Filter by season range, featured characters, and episode tags
- Seen-episode tracking with localStorage persistence
- Shareable URLs that restore the current episode and filters
- Space/Enter keyboard shortcut to spin
- Direct watch link to WCOFlix

## Development

```bash
bun install
bun run dev        # http://localhost:5173
```

## Building

```bash
bun run build      # output → build/
bun run preview    # preview the build locally
```

## Testing

```bash
bun run test          # unit tests
bun run test:watch    # unit tests in watch mode
bun run test:e2e      # e2e with Playwright (requires dev server on :5173)
```

## Updating Episode Data

The episode list is a static JSON file committed to the repo. To refresh it after a new season or to fix data:

```bash
bun run scrape
```

This scrapes all 28 seasons from the Wikipedia API and overwrites `src/lib/data/episodes.json`. Character lists and IMDB ratings must be filled in manually after scraping.

## Deployment

Deploys automatically to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev) with `adapter-static`
- [UnoCSS](https://unocss.dev) (Tailwind-compatible utilities)
- [Effect](https://effect.website) for composable random selection
- [Melt UI](https://melt-ui.com) for accessible UI primitives
- [Biome](https://biomejs.dev) for linting and formatting
- [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) for testing
