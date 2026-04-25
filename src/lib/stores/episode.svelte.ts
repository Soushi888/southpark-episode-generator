import type { Episode } from '$lib/types'

function createEpisodeStore() {
  let current = $state<Episode | null>(null)
  let spinning = $state(false)

  return {
    get current() { return current },
    set current(v: Episode | null) { current = v },
    get spinning() { return spinning },
    set spinning(v: boolean) { spinning = v }
  }
}

export const episodeStore = createEpisodeStore()
