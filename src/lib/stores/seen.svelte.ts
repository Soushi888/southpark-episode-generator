import type { EpisodeId } from '$lib/types'

const STORAGE_KEY = 'sp-seen-episodes'

function createSeenStore() {
  let ids = $state<Set<EpisodeId>>(
    typeof localStorage !== 'undefined'
      ? new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
      : new Set()
  )

  function persist() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
    }
  }

  return {
    get ids() { return ids },
    markSeen(id: EpisodeId) {
      ids = new Set([...ids, id])
      persist()
    },
    markUnseen(id: EpisodeId) {
      const next = new Set(ids)
      next.delete(id)
      ids = next
      persist()
    },
    reset() {
      ids = new Set()
      if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY)
    }
  }
}

export const seenStore = createSeenStore()
