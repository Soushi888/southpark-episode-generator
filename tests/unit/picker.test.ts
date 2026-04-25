import { describe, it, expect } from 'vitest'
import { pickEpisode } from '../../src/lib/picker'
import type { Episode } from '../../src/lib/types'

const makeEpisode = (id: string): Episode => ({
  id,
  season: 1,
  episode: Number(id.slice(-2)),
  title: id,
  watchUrl: `https://www.wcoflix.tv/south-park-season-1-episode-1-${id.toLowerCase()}`,
  airDate: '',
  description: '',
  characters: [],
  tags: []
})

const pool = [
  makeEpisode('S01E01'),
  makeEpisode('S01E02'),
  makeEpisode('S01E03'),
  makeEpisode('S01E04')
]

describe('pickEpisode', () => {
  it('returns an episode from the pool', () => {
    const ep = pickEpisode(pool)
    expect(pool.map((e) => e.id)).toContain(ep.id)
  })

  it('throws on empty pool', () => {
    expect(() => pickEpisode([])).toThrow()
  })

  it('works with a single-item pool', () => {
    const ep = pickEpisode([pool[0]])
    expect(ep.id).toBe('S01E01')
  })

  it('covers all episodes over many runs', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 500; i++) {
      seen.add(pickEpisode(pool).id)
    }
    expect(seen.size).toBe(pool.length)
  })
})
