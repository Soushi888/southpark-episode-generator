import { describe, it, expect } from 'vitest'
import { encodeFilters, decodeFilters } from '../../src/lib/url-state'
import { MAX_SEASON } from '../../src/lib/types'
import type { FilterState } from '../../src/lib/types'

const defaults: FilterState = {
  seasonRange: [1, MAX_SEASON],
  characters: [],
  tags: [],
  excludeSeen: false
}

const url = (search: string) => new URL(`http://localhost/${search}`)

describe('encodeFilters', () => {
  it('returns empty string for default filters', () => {
    expect(encodeFilters(defaults, null)).toBe('')
  })

  it('encodes episode id', () => {
    expect(encodeFilters(defaults, 'S01E01')).toBe('?ep=S01E01')
  })

  it('encodes season range', () => {
    const result = encodeFilters({ ...defaults, seasonRange: [3, 10] }, null)
    expect(result).toContain('s=3-10')
  })

  it('encodes characters', () => {
    const result = encodeFilters({ ...defaults, characters: ['Cartman', 'Kyle'] }, null)
    expect(result).toContain('c=Cartman%2CKyle')
  })

  it('encodes tags', () => {
    const result = encodeFilters({ ...defaults, tags: ['classic', 'holiday'] }, null)
    expect(result).toContain('t=classic%2Choliday')
  })
})

describe('decodeFilters', () => {
  it('returns defaults for empty URL', () => {
    const { episodeId, ...f } = decodeFilters(url(''))
    expect(f.seasonRange).toEqual([1, MAX_SEASON])
    expect(f.characters).toEqual([])
    expect(f.tags).toEqual([])
    expect(episodeId).toBeNull()
  })

  it('decodes episode id', () => {
    const { episodeId } = decodeFilters(url('?ep=S05E01'))
    expect(episodeId).toBe('S05E01')
  })

  it('decodes season range', () => {
    const { seasonRange } = decodeFilters(url('?s=3-10'))
    expect(seasonRange).toEqual([3, 10])
  })

  it('decodes characters', () => {
    const { characters } = decodeFilters(url('?c=Cartman,Kyle'))
    expect(characters).toEqual(['Cartman', 'Kyle'])
  })

  it('round-trips encode → decode', () => {
    const original: FilterState = {
      seasonRange: [5, 15],
      characters: ['Cartman'],
      tags: ['classic', 'holiday'],
      excludeSeen: false
    }
    const encoded = encodeFilters(original, 'S10E08')
    const { episodeId, excludeSeen, ...decoded } = decodeFilters(url(encoded))
    expect(episodeId).toBe('S10E08')
    expect(decoded.seasonRange).toEqual(original.seasonRange)
    expect(decoded.characters).toEqual(original.characters)
    expect(decoded.tags).toEqual(original.tags)
  })
})
