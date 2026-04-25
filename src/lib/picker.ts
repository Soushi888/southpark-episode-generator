import type { Episode } from '$lib/types'

export const pickEpisode = (episodes: Episode[]): Episode => {
  if (episodes.length === 0) throw new Error('No episodes match the current filters')
  return episodes[Math.floor(Math.random() * episodes.length)]
}
