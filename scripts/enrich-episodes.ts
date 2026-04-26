/**
 * Enrich episodes.json with airDate, description, characters, and tags.
 *
 * Sources:
 *   TVmaze   → airDate + description (329/329 episodes)
 *   spapi.dev → characters per episode (314/329 episodes)
 *   Fandom   → tags via MediaWiki categories (all episodes)
 *   Computed → season-finale, classic, movie-length
 *
 * Usage: bun run scripts/enrich-episodes.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type EpisodeTag =
	| "classic"
	| "controversial"
	| "cartman-centric"
	| "kenny-dies"
	| "randy-centric"
	| "butters-centric"
	| "movie-length"
	| "season-finale"
	| "holiday"
	| "celebrity-parody"
	| "meta"
	| "trilogy";

type Episode = {
	id: string;
	season: number;
	episode: number;
	title: string;
	watchUrl: string;
	airDate: string;
	description: string;
	characters: string[];
	tags: EpisodeTag[];
};

// Hardcoded spapi.dev character IDs → TOP_CHARACTERS short names
// (avoids fetching all 22 character pages; pages 21-22 return HTTP 500)
const TOP_CHAR_IDS: Record<number, string> = {
	3: "Kyle",
	11: "Cartman",
	32: "Stan",
	42: "Kenny",
	159: "Butters",
	30: "Randy",
	190: "Tweek",
	180: "Craig",
	88: "Mr. Garrison",
	137: "PC Principal",
};

// Fandom category → EpisodeTag (direct mapping)
const CATEGORY_TAG: Record<string, EpisodeTag> = {
	"Category:Episodes Where Kenny Dies": "kenny-dies",
	"Category:Holiday Episodes": "holiday",
	"Category:Christmas Specials": "holiday",
	"Category:Episodes With Celebrity Appearances": "celebrity-parody",
	"Category:Multi-Parter Episodes": "trilogy",
	"Category:Banned Episodes": "controversial",
	"Category:Episodes Focusing On Mr. Garrison": "garrison-centric",
};

// Fandom focus categories → character name
const FOCUS_CHAR: Record<string, string> = {
	"Category:Episodes Focusing On Cartman": "Cartman",
	"Category:Episodes Focusing On Randy": "Randy",
	"Category:Episodes Focusing On Butters": "Butters",
};

// Character → centric tag (only applied when focused chars ≤ 2)
const CHAR_CENTRIC_TAG: Record<string, EpisodeTag> = {
	Cartman: "cartman-centric",
	Randy: "randy-centric",
	Butters: "butters-centric",
};

function stripHtml(html: string): string {
	return html
		.replace(/<[^>]+>/g, "")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.trim();
}

function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

// ── Phase 1: TVmaze ──────────────────────────────────────────────────────────

type TVData = { airDate: string; description: string; runtime: number };

async function fetchTVmaze(): Promise<Map<string, TVData>> {
	console.log("Phase 1: Fetching TVmaze episodes...");
	const res = await fetch("https://api.tvmaze.com/shows/112/episodes");
	const data = (await res.json()) as Array<{
		season: number;
		number: number;
		airdate: string;
		summary: string | null;
		runtime: number | null;
	}>;

	const map = new Map<string, TVData>();
	for (const ep of data) {
		const id = `S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}`;
		map.set(id, {
			airDate: ep.airdate ?? "",
			description: ep.summary ? stripHtml(ep.summary) : "",
			runtime: ep.runtime ?? 30,
		});
	}
	console.log(`  → ${map.size} episodes`);
	return map;
}

// ── Phase 2: spapi.dev characters ────────────────────────────────────────────

type SpapiEp = { wikiUrl: string; characters: string[] };

async function fetchSpapi(): Promise<Map<string, SpapiEp>> {
	console.log("Phase 2: Fetching spapi.dev data...");

	const map = new Map<string, SpapiEp>();
	let page = 1;
	while (true) {
		const res = await fetch(`https://spapi.dev/api/episodes?page=${page}`);
		const text = await res.text();
		let data: {
			data: Array<{
				season: number;
				episode: number;
				wiki_url: string;
				characters: string[];
			}>;
			meta: { current_page: number; last_page: number };
		};
		try {
			data = JSON.parse(text);
		} catch {
			console.warn(`  Page ${page} parse error, skipping`);
			page++;
			if (page > 40) break;
			await sleep(300);
			continue;
		}

		for (const ep of data.data) {
			const id = `S${String(ep.season).padStart(2, "0")}E${String(ep.episode).padStart(2, "0")}`;
			const chars = (ep.characters ?? [])
				.map((url: string) => {
					const m = url.match(/\/characters\/(\d+)/);
					if (!m) return null;
					return TOP_CHAR_IDS[Number(m[1])] ?? null;
				})
				.filter((n): n is string => n !== null)
				.filter((n, i, a) => a.indexOf(n) === i);

			map.set(id, { wikiUrl: ep.wiki_url ?? "", characters: chars });
		}

		if (data.meta.current_page >= data.meta.last_page) break;
		page++;
		await sleep(150);
	}
	console.log(`  → ${map.size} episodes`);
	return map;
}

// ── Phase 3: Fandom categories → tags ────────────────────────────────────────

function titleToWikiPage(title: string): string {
	// Convert episode title to Fandom wiki page name format
	return title.replace(/ /g, "_").replace(/'/g, "'");
}

function wikiUrlToPage(url: string): string {
	const m = url.match(/\/wiki\/(.+)$/);
	return m ? decodeURIComponent(m[1]) : "";
}

function catsToTags(cats: string[]): EpisodeTag[] {
	const tags = new Set<EpisodeTag>();

	for (const cat of cats) {
		const direct = CATEGORY_TAG[cat];
		if (direct) tags.add(direct);
	}

	// Character-centric: only apply when ≤ 2 characters are "focused on"
	// Count ALL "Focusing On" categories to determine if episode is truly centric
	const totalFocusCount = cats.filter((c) =>
		c.startsWith("Category:Episodes Focusing On"),
	).length;
	if (totalFocusCount <= 2) {
		const focused = cats
			.map((c) => FOCUS_CHAR[c])
			.filter((n): n is string => n !== undefined);
		for (const char of focused) {
			const tag = CHAR_CENTRIC_TAG[char];
			if (tag) tags.add(tag);
		}
	}

	return [...tags];
}

async function fetchFandomTags(
	episodes: Episode[],
	spapiMap: Map<string, SpapiEp>,
): Promise<Map<string, EpisodeTag[]>> {
	console.log("Phase 3: Fetching Fandom categories...");
	const result = new Map<string, EpisodeTag[]>();

	// Build page → episode ID map
	const pageToId = new Map<string, string>();
	for (const ep of episodes) {
		const spapi = spapiMap.get(ep.id);
		const page = spapi?.wikiUrl
			? wikiUrlToPage(spapi.wikiUrl)
			: titleToWikiPage(ep.title);
		if (page) pageToId.set(page, ep.id);
	}

	const pages = [...pageToId.keys()];
	const BATCH = 50;

	for (let i = 0; i < pages.length; i += BATCH) {
		const batch = pages.slice(i, i + BATCH);
		const titlesParam = batch.map(encodeURIComponent).join("|");
		const url = `https://southpark.fandom.com/api.php?action=query&titles=${titlesParam}&prop=categories&cllimit=500&format=json`;

		try {
			const res = await fetch(url);
			const data = (await res.json()) as {
				query: {
					pages: Record<
						string,
						{ title: string; categories?: Array<{ title: string }> }
					>;
				};
			};

			for (const page of Object.values(data.query.pages)) {
				const normalized = page.title?.replace(/ /g, "_") ?? "";
				const epId = pageToId.get(normalized);
				if (!epId) continue;
				const cats = (page.categories ?? []).map((c) => c.title);
				result.set(epId, catsToTags(cats));
			}
		} catch (e) {
			console.error(`  Batch ${i / BATCH + 1} error:`, e);
		}

		process.stdout.write(
			`\r  → ${Math.min(i + BATCH, pages.length)}/${pages.length} processed`,
		);
		await sleep(400);
	}
	console.log();
	return result;
}

// ── Phase 4: Derived tags ─────────────────────────────────────────────────────

function derivedTags(
	ep: Episode,
	lastEpPerSeason: Map<number, number>,
	runtime: number,
): EpisodeTag[] {
	const tags: EpisodeTag[] = [];
	if (ep.episode === lastEpPerSeason.get(ep.season)) tags.push("season-finale");
	if (ep.season <= 7) tags.push("classic");
	if (runtime > 45) tags.push("movie-length");
	return tags;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
	const epPath = join(import.meta.dir, "../src/lib/data/episodes.json");
	const episodes: Episode[] = JSON.parse(readFileSync(epPath, "utf-8"));

	const lastEpPerSeason = new Map<number, number>();
	for (const ep of episodes) {
		const cur = lastEpPerSeason.get(ep.season) ?? 0;
		if (ep.episode > cur) lastEpPerSeason.set(ep.season, ep.episode);
	}

	const tvmaze = await fetchTVmaze();
	const spapi = await fetchSpapi();
	const fandom = await fetchFandomTags(episodes, spapi);

	console.log("Merging...");

	for (const ep of episodes) {
		const tv = tvmaze.get(ep.id);
		if (tv) {
			ep.airDate = tv.airDate;
			ep.description = tv.description;
		}

		const sp = spapi.get(ep.id);
		if (sp?.characters.length) {
			ep.characters = sp.characters;
		}

		const fTags = fandom.get(ep.id) ?? [];
		const dTags = derivedTags(ep, lastEpPerSeason, tv?.runtime ?? 30);
		const merged = [...new Set([...fTags, ...dTags])] as EpisodeTag[];
		if (merged.length) ep.tags = merged;
	}

	writeFileSync(epPath, JSON.stringify(episodes, null, 2));

	const w = (fn: (ep: Episode) => boolean) =>
		episodes.filter(fn).length;
	console.log(`\nWrote ${episodes.length} episodes → ${epPath}`);
	console.log("Coverage:");
	console.log(`  airDate:     ${w((e) => !!e.airDate)}/${episodes.length}`);
	console.log(`  description: ${w((e) => !!e.description)}/${episodes.length}`);
	console.log(`  characters:  ${w((e) => e.characters.length > 0)}/${episodes.length}`);
	console.log(`  tags:        ${w((e) => e.tags.length > 0)}/${episodes.length}`);
}

main().catch(console.error);
