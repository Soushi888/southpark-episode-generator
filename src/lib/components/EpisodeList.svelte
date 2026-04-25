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
</script>

<div class="w-full max-w-2xl">
  <h3 class="sp-heading text-white/40 text-base tracking-widest uppercase mb-4">
    All Episodes — {episodes.length} total
  </h3>

  {#each seasons as season}
    <div class="mb-6">
      <p class="sp-heading text-sp-yellow text-sm tracking-widest uppercase mb-1 px-3">
        Season {season}
      </p>
      <div class="flex flex-col">
        {#each bySeason[season] as ep (ep.id)}
          {@const active = episodeStore.current?.id === ep.id}
          <button
            class="flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors w-full {active
              ? 'bg-sp-yellow/10 border border-sp-yellow/20'
              : 'hover:bg-white/5 border border-transparent'}"
            onclick={() => (episodeStore.current = ep)}
          >
            <EpisodeBadge season={ep.season} episode={ep.episode} />
            <span class="text-sm flex-1 min-w-0 truncate {active ? 'text-white font-bold' : 'text-white/60'}">
              {ep.title}
            </span>
            {#if seenStore.ids.has(ep.id)}
              <span class="text-white/20 text-xs shrink-0">✓</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>
