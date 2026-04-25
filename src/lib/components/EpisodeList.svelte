<script lang="ts">
  import { episodeStore } from '$lib/stores/episode.svelte'
  import { seenStore } from '$lib/stores/seen.svelte'
  import EpisodeBadge from './EpisodeBadge.svelte'
  import type { Episode } from '$lib/types'

  let { episodes }: { episodes: Episode[] } = $props()

  const bySeason = $derived(
    episodes.reduce(
      (acc, ep) => {
        ;(acc[ep.season] ??= []).push(ep)
        return acc
      },
      {} as Record<number, Episode[]>
    )
  )

  const seasons = $derived(Object.keys(bySeason).map(Number).sort((a, b) => a - b))

  const jumpSeasons = $derived(
    seasons.filter((s) => [1, 5, 10, 15, 20, 25, 28].includes(s))
  )

  function jumpTo(season: number) {
    document.getElementById(`season-${season}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
</script>

<div class="w-full">
  <div class="flex items-center justify-between mb-3">
    <h3 class="sp-heading text-white/40 text-base tracking-widest uppercase">
      {episodes.length} Episodes
    </h3>
  </div>

  {#if jumpSeasons.length > 1}
    <div class="flex flex-wrap gap-2 mb-5">
      {#each jumpSeasons as s}
        <button
          onclick={() => jumpTo(s)}
          class="px-3 py-1 text-xs font-mono bg-white/5 hover:bg-sp-yellow/20 hover:text-sp-yellow text-white/40 rounded-lg transition-colors border border-white/10"
        >
          S{String(s).padStart(2, '0')}
        </button>
      {/each}
    </div>
  {/if}

  {#each seasons as season}
    <div class="mb-4" id="season-{season}">
      <div class="sticky top-0 z-10 bg-sp-darker py-2 px-3 -mx-3 flex items-center justify-between">
        <p class="sp-heading text-sp-yellow text-base tracking-widest uppercase">
          Season {season}
        </p>
        <span class="text-white/30 text-xs">{bySeason[season].length} ep</span>
      </div>

      <div class="flex flex-col">
        {#each bySeason[season] as ep, i (ep.id)}
          {@const active = episodeStore.current?.id === ep.id}
          {@const seen = seenStore.ids.has(ep.id)}
          <button
            class="flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all w-full group
              {i % 2 === 0 ? 'bg-white/2' : ''}
              {active
                ? 'bg-sp-yellow/15 border border-sp-yellow/30 translate-x-1'
                : 'border border-transparent hover:bg-sp-yellow/8 hover:translate-x-1'}"
            onclick={() => (episodeStore.current = ep)}
          >
            <EpisodeBadge season={ep.season} episode={ep.episode} />
            <span class="text-sm flex-1 min-w-0 truncate transition-colors
              {active ? 'text-white font-bold' : seen ? 'text-white/30 line-through' : 'text-white/60 group-hover:text-white/90'}">
              {ep.title}
            </span>
            {#if seen}
              <span class="text-sp-yellow/40 text-xs shrink-0">✓</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>
