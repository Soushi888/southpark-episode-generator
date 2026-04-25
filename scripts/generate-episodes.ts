/**
 * Generates src/lib/data/episodes.json from the scraped wcoflix URL list.
 * Usage: bun run scripts/generate-episodes.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// ---------- title corrections for slugs that auto-conversion gets wrong ----------
const CORRECTIONS: Record<string, string> = {
  // Possessives/contractions the auto-converter misses
  'cartman-s-mom-is-a-dirty-slut-1': "Cartman's Mom Is a Dirty Slut",
  'cartman-s-mom-is-still-a-dirty-slut-2': "Cartman's Mom Is Still a Dirty Slut",
  'chef-s-salty-chocolate-balls': "Chef's Salty Chocolate Balls",
  'tom-s-rhinoplasty': "Tom's Rhinoplasty",
  'mr-hankey-s-christmas-classics': "Mr. Hankey's Christmas Classics",
  'mr-garrison-s-fancy-new-vagina': "Mr. Garrison's Fancy New Vagina",
  'korn-s-groovy-pirate-ghost-mystery': "Korn's Groovy Pirate Ghost Mystery",
  'cartman-s-silly-hate-crime-2000': "Cartman's Silly Hate Crime 2000",
  'cartman-s-incredible-gift': "Cartman's Incredible Gift",
  'stanley-s-cup': "Stanley's Cup",
  'britney-s-new-look': "Britney's New Look",
  'bebe-s-boobs-destroy-society': "Bebe's Boobs Destroy Society",
  'red-man-s-greed': "Red Man's Greed",
  'it-s-christmas-in-canada': "It's Christmas in Canada",
  'it-s-a-jersey-thing': "It's a Jersey Thing",
  'are-you-there-god-it-s-me-jesus': "Are You There God? It's Me, Jesus",
  'i-m-a-little-bit-country': "I'm a Little Bit Country",
  'you-re-getting-old': "You're Getting Old",
  'you-re-not-yelping': "You're Not Yelping",
  'freemium-isn-t-free': "Freemium Isn't Free",
  'butters-very-own-episode': "Butters' Very Own Episode",
  'butters-bottom-bitch': "Butters' Bottom Bitch",
  'the-tooth-fairy-s-tats-2000': "The Tooth Fairy's Tats 2000",
  // Special titles
  '1': '1%',
  'season-finale13': 'Season Finale',
  'awesom-o': 'AWESOM-O',
  'w-t-f': 'W.T.F.',
  't-m-i': 'T.M.I.',
  'humancentipad': 'HUMANCENTiPAD',
  'crme-fraiche': 'Crème Fraîche',
  'happyholograms': '#HappyHolograms',
  'manbearpig': 'ManBearPig',
  'tsst': 'Tsst',
  'go-god-go-1': 'Go God Go',
  'go-god-go-xii-2': 'Go God Go XII',
  'cartoon-wars-1': 'Cartoon Wars Part I',
  'cartoon-wars-2': 'Cartoon Wars Part II',
  'imaginationland-episode-i': 'Imaginationland',
  'imaginationland-ii': 'Imaginationland Episode II',
  'imaginationland-iii': 'Imaginationland Episode III',
  'coon-2-hindsight': 'Coon 2: Hindsight',
  'cat-orgy-1': 'Cat Orgy',
  'two-guys-naked-in-a-hot-tub-2': 'Two Guys Naked in a Hot Tub',
  'jewbilee-3': 'Jewbilee',
  'pip-a-k-a-great-expectations': 'Pip (A.K.A. Great Expectations)',
  'city-on-the-edge-of-forever-a-k-a-flashbacks': 'City on the Edge of Forever',
  'pandemic-2-the-startling': 'Pandemic 2: The Startling',
  'goth-kids-3-dawn-of-the-posers': 'Goth Kids 3: Dawn of the Posers',
  'about-last-night': 'About Last Night...',
  'hummels-heroin': 'Hummels & Heroin',
  'coon-vs-coon-and-friends': 'Coon vs. Coon & Friends',
  'the-new-terrance-phillip-movie-trailer': 'The New Terrance & Phillip Movie Trailer',
  'you-got-f-cked-in-the-ass': "You Got F'd in the A",
  'osama-bin-laden-has-farty-pants': 'Osama bin Laden Has Farty Pants',
  'my-my-future-self-n-me': "My Future Self n' Me",
  'smug-alert': 'Smug Alert!',
  'eek-a-penis': 'Eek, a Penis!',
  'die-hippie-die': 'Die Hippie, Die',
  'follow-that-egg': 'Follow That Egg!',
  'd-yikes': 'D-Yikes!',
  'south-park-is-gay': 'South Park Is Gay!',
  'where-my-country-gone': 'Where My Country Gone?',
  'nobody-got-cereal': 'Nobody Got Cereal?',
  'do-the-handicapped-go-to-hell': 'Do the Handicapped Go to Hell?',
  'helen-keller-the-musical': 'Helen Keller! The Musical',
  'shots': 'Shots!!!',
  'post-covid': 'Post Covid',
  'cartman-joins-nambla': 'Cartman Joins NAMBLA',
  'lil-crime-stoppers': "Lil' Crime Stoppers",
  'starvin-marvin-in-space': "Starvin' Marvin in Space",
  'lil-crime-stoppers': "Lil' Crime Stoppers",
  'credigree-weed-st-patricks-day-special': "Credigree Weed St. Patrick's Day Special",
  'dikimbles-hot-dogs': "Dikinmisses's Hot Dogs",
  'help-my-teenager-hates-me': 'Help, My Teenager Hates Me!',
  'oh-jeez': 'Oh, Jeez',
  'let-go-let-gov': 'Let Go, Let Gov',
  'eat-pray-queef': 'Eat, Pray, Queef',
  'tweek-x-craig': 'Tweek x Craig',
  // Season 16 (-2 suffix is a wcoflix artifact — strip from title)
  'reverse-cowgirl-2': 'Reverse Cowgirl',
  'cash-for-gold-2': 'Cash for Gold',
  'faith-hilling-2': 'Faith Hilling',
  'jewpacabra-2': 'Jewpacabra',
  'butterballs-2': 'Butterballs',
  'i-should-have-never-gone-ziplining-2': 'I Should Have Never Gone Ziplining',
  'cartman-finds-love-2': 'Cartman Finds Love',
  'sarcastaball-2': 'Sarcastaball',
  'raising-the-bar-2': 'Raising the Bar',
  'insecurity-2': 'Insecurity',
  'going-native-2': 'Going Native',
  'a-nightmare-on-face-time-2': 'A Nightmare on Face Time',
  'a-scause-for-applause-2': 'A Scause for Applause',
  'obama-wins-2': 'Obama Wins!',
}

// Words kept lowercase inside a title
const SMALL = new Set([
  'a','an','the','and','or','but','for','nor','on','at','to','in','of','is',
  'it','if','vs','n','as','by','up'
])

function slugToTitle(slug: string): string {
  const tokens = slug.split('-')
  const out: string[] = []

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (!t) continue

    // Possessive / contraction: merge into previous token
    const CONTRACTIONS = new Set(['s', 're', 've', 'll', 't', 'd', 'm'])
    if (CONTRACTIONS.has(t) && out.length > 0) {
      out[out.length - 1] = out[out.length - 1] + "'" + t
      continue
    }

    const capitalize =
      i === 0 || !SMALL.has(t.toLowerCase())

    out.push(
      capitalize
        ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
        : t.toLowerCase()
    )
  }

  return out.join(' ')
}

function parseUrl(raw: string): { season: number; episode: number; slug: string; watchUrl: string } | null {
  // Fix double-season typo: /south-park-season-season-23-...
  const fixed = raw.replace('/south-park-season-season-', '/south-park-season-')
  const m = fixed.match(/^\/south-park-season-(\d+)-episode-(\d+)-(.+)$/)
  if (!m) return null
  return {
    season: parseInt(m[1]),
    episode: parseInt(m[2]),
    slug: m[3],
    watchUrl: 'https://www.wcoflix.tv' + fixed
  }
}

// ---------- main ----------
const raw = readFileSync('/tmp/southpark_episodes.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean)

const episodes: object[] = []
const seen = new Set<string>()

for (const line of raw) {
  const parsed = parseUrl(line)
  if (!parsed) { console.warn('Skipped (unparseable):', line); continue }

  const { season, episode, slug, watchUrl } = parsed
  const id = `S${String(season).padStart(2,'0')}E${String(episode).padStart(2,'0')}`

  // Skip the non-canonical S16E9 rehash duplicate (keep the -2 version)
  if (slug === 'rehash') continue
  // Deduplicate
  if (seen.has(id)) continue
  seen.add(id)

  const title = CORRECTIONS[slug] ?? slugToTitle(slug)

  episodes.push({ id, season, episode, title, watchUrl, airDate: '', description: '', characters: [], tags: [] })
}

// Sort season → episode
episodes.sort((a: any, b: any) =>
  a.season !== b.season ? a.season - b.season : a.episode - b.episode
)

const out = join(import.meta.dir, '../src/lib/data/episodes.json')
writeFileSync(out, JSON.stringify(episodes, null, 2))
console.log(`✓ Wrote ${episodes.length} episodes → ${out}`)
