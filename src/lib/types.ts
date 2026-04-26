export type EpisodeId = string // "S01E04"

export type EpisodeTag =
  | 'classic'
  | 'controversial'
  | 'cartman-centric'
  | 'kenny-dies'
  | 'randy-centric'
  | 'butters-centric'
  | 'movie-length'
  | 'season-finale'
  | 'holiday'
  | 'celebrity-parody'
  | 'meta'
  | 'trilogy'
  | 'garrison-centric'

export type Episode = {
  id: EpisodeId
  season: number
  episode: number
  title: string
  watchUrl: string
  airDate: string
  description: string
  characters: string[]
  tags: EpisodeTag[]
  imdbRating?: number
}

export type FilterState = {
  seasonRange: [number, number]
  characters: string[]
  tags: EpisodeTag[]
  excludeSeen: boolean
}

export type AppState = {
  currentEpisode: Episode | null
  filters: FilterState
  isSpinning: boolean
  seenEpisodeIds: Set<EpisodeId>
}

export const WATCH_BASE = 'https://www.wcoflix.tv'
export const MAX_SEASON = 28

export const toWatchUrl = (ep: Pick<Episode, 'season' | 'episode' | 'title'>): string => {
  const slug = ep.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return `${WATCH_BASE}/south-park-season-${ep.season}-episode-${ep.episode}-${slug}`
}

export const formatEpisodeId = (season: number, episode: number): EpisodeId =>
  `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`

export const TOP_CHARACTERS = [
  'Cartman',
  'Kyle',
  'Stan',
  'Kenny',
  'Butters',
  'Randy',
  'Tweek',
  'Craig',
  'Mr. Garrison',
  'PC Principal'
] as const
