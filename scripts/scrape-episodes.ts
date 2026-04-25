/**
 * Scrape South Park episode data from Wikipedia and write episodes.json.
 *
 * Usage: bun run scripts/scrape-episodes.ts
 *
 * Requires: bun (built-in fetch)
 */

import { writeFileSync } from "fs";
import { join } from "path";

type RawEpisode = {
  id: string;
  season: number;
  episode: number;
  title: string;
  airDate: string;
  description: string;
  characters: string[];
  tags: string[];
  imdbRating?: number;
};

const WIKI_BASE =
  "https://en.wikipedia.org/w/api.php?action=parse&prop=wikitext&format=json&page=";

const SEASON_PAGES = Array.from(
  { length: 28 },
  (_, i) => `South_Park_season_${i + 1}`,
);

async function fetchWikitext(page: string): Promise<string> {
  const res = await fetch(`${WIKI_BASE}${encodeURIComponent(page)}`);
  const json = (await res.json()) as {
    parse?: { wikitext?: { "*"?: string } };
  };
  return json.parse?.wikitext?.["*"] ?? "";
}

function parseEpisodes(wikitext: string, season: number): RawEpisode[] {
  const episodes: RawEpisode[] = [];
  const epRegex =
    /\|\s*Title\s*=\s*"?([^"\n|]+)"?[\s\S]*?\|\s*Airdate\s*=\s*([^\n|]+)[\s\S]*?\|\s*ShortSummary\s*=\s*([^\n}]+)/gi;

  let match: RegExpExecArray | null;
  let epNum = 1;

  while ((match = epRegex.exec(wikitext)) !== null) {
    const title = match[1]
      .trim()
      .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1");
    const airDateRaw = match[2]
      .trim()
      .replace(/{{[^}]+}}/g, "")
      .trim();
    const description = match[3]
      .trim()
      .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1");

    const id = `S${String(season).padStart(2, "0")}E${String(epNum).padStart(2, "0")}`;
    episodes.push({
      id,
      season,
      episode: epNum,
      title,
      airDate: airDateRaw,
      description: description.substring(0, 300),
      characters: [],
      tags: [],
    });
    epNum++;
  }

  return episodes;
}

async function main() {
  const allEpisodes: RawEpisode[] = [];

  for (const page of SEASON_PAGES) {
    const seasonNum = Number(page.split("_").pop());
    console.log(`Scraping season ${seasonNum}...`);
    try {
      const wikitext = await fetchWikitext(page);
      const episodes = parseEpisodes(wikitext, seasonNum);
      allEpisodes.push(...episodes);
      console.log(`  → ${episodes.length} episodes found`);
    } catch (e) {
      console.error(`  Error scraping season ${seasonNum}:`, e);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  const outPath = join(import.meta.dir, "../src/lib/data/episodes.json");
  writeFileSync(outPath, JSON.stringify(allEpisodes, null, 2));
  console.log(`\nWrote ${allEpisodes.length} episodes to ${outPath}`);
}

main();
