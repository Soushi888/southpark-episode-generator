import type { FilterState, EpisodeTag } from '$lib/types'
import { MAX_SEASON } from '$lib/types'

const DEFAULT: FilterState = {
  seasonRange: [1, MAX_SEASON],
  characters: [],
  tags: [],
  excludeSeen: false
}

export function encodeFilters(filters: FilterState, episodeId: string | null): string {
  const params = new URLSearchParams()
  if (episodeId) params.set('ep', episodeId)
  const [min, max] = filters.seasonRange
  if (min !== DEFAULT.seasonRange[0] || max !== DEFAULT.seasonRange[1]) {
    params.set('s', `${min}-${max}`)
  }
  if (filters.characters.length > 0) params.set('c', filters.characters.join(','))
  if (filters.tags.length > 0) params.set('t', filters.tags.join(','))
  const str = params.toString()
  return str ? `?${str}` : ''
}

export function decodeFilters(url: URL): FilterState & { episodeId: string | null } {
  const s = url.searchParams.get('s')
  const c = url.searchParams.get('c')
  const t = url.searchParams.get('t')
  const ep = url.searchParams.get('ep')

  const seasonRange: [number, number] = s
    ? (() => {
        const parts = s.split('-').map(Number)
        return [
          isNaN(parts[0]) ? 1 : Math.max(1, parts[0]),
          isNaN(parts[1]) ? MAX_SEASON : Math.min(MAX_SEASON, parts[1])
        ] as [number, number]
      })()
    : [1, MAX_SEASON]

  const characters = c ? c.split(',').filter(Boolean) : []
  const tags = t ? (t.split(',').filter(Boolean) as EpisodeTag[]) : []

  return { seasonRange, characters, tags, excludeSeen: false, episodeId: ep }
}
