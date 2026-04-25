import type { FilterState, EpisodeTag, Episode } from '$lib/types'
import { MAX_SEASON } from '$lib/types'
import { seenStore } from './seen.svelte'
import episodesData from '$lib/data/episodes.json'

const episodes = episodesData as Episode[]

export const defaultFilters: FilterState = {
  seasonRange: [1, MAX_SEASON],
  characters: [],
  tags: [],
  excludeSeen: false
}

function createFilterStore() {
  let seasonRange = $state<[number, number]>([1, MAX_SEASON])
  let characters = $state<string[]>([])
  let tags = $state<EpisodeTag[]>([])
  let excludeSeen = $state(false)

  const filtered = $derived(
    episodes.filter((ep) => {
      if (ep.season < seasonRange[0] || ep.season > seasonRange[1]) return false
      if (characters.length > 0 && !characters.some((c) => ep.characters.includes(c))) return false
      if (tags.length > 0 && !tags.some((t) => ep.tags.includes(t))) return false
      if (excludeSeen && seenStore.ids.has(ep.id)) return false
      return true
    })
  )

  const count = $derived(filtered.length)

  return {
    get seasonRange() { return seasonRange },
    set seasonRange(v: [number, number]) { seasonRange = v },
    get characters() { return characters },
    set characters(v: string[]) { characters = v },
    get tags() { return tags },
    set tags(v: EpisodeTag[]) { tags = v },
    get excludeSeen() { return excludeSeen },
    set excludeSeen(v: boolean) { excludeSeen = v },
    get filtered() { return filtered },
    get count() { return count },
    get state(): FilterState {
      return { seasonRange, characters, tags, excludeSeen }
    },
    setFromState(s: FilterState) {
      seasonRange = s.seasonRange
      characters = s.characters
      tags = s.tags as EpisodeTag[]
      excludeSeen = s.excludeSeen
    },
    reset() {
      seasonRange = [1, MAX_SEASON]
      characters = []
      tags = []
      excludeSeen = false
    }
  }
}

export const filterStore = createFilterStore()
