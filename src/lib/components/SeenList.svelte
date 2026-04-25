<script lang="ts">
  import { seenStore } from '$lib/stores/seen.svelte'
  import { episodeStore } from '$lib/stores/episode.svelte'
  import EpisodeBadge from './EpisodeBadge.svelte'
  import episodesData from '$lib/data/episodes.json'
  import type { Episode } from '$lib/types'

  const allEpisodes = episodesData as Episode[]

  let open = $state(false)

  const seenEpisodes = $derived(
    allEpisodes
      .filter((ep) => seenStore.ids.has(ep.id))
      .sort((a, b) => a.season - b.season || a.episode - b.episode)
  )
</script>

{#if seenEpisodes.length > 0}
  <div class="w-full max-w-2xl">
    <div class="flex items-center gap-2 mb-2">
      <button
        onclick={() => (open = !open)}
        class="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors flex-1 text-left"
      >
        <span class="transform transition-transform duration-200 {open ? 'rotate-90' : ''}">▶</span>
        <span class="sp-heading tracking-widest uppercase text-xs">Seen Episodes</span>
        <span class="pill bg-white/10 text-white/40 text-xs">{seenEpisodes.length}</span>
      </button>
      <button
        onclick={() => seenStore.reset()}
        class="text-xs text-sp-red/50 hover:text-sp-red transition-colors shrink-0"
      >
        Clear all
      </button>
    </div>

    {#if open}
      <div class="card-base flex flex-col gap-0.5 p-3">
        {#each seenEpisodes as ep (ep.id)}
          {@const active = episodeStore.current?.id === ep.id}
          <div
            class="flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors group {active
              ? 'bg-sp-yellow/10'
              : 'hover:bg-white/5'}"
          >
            <EpisodeBadge season={ep.season} episode={ep.episode} />
            <button
              class="text-sm flex-1 min-w-0 truncate text-left transition-colors {active
                ? 'text-white font-bold'
                : 'text-white/50 hover:text-white/80'}"
              onclick={() => (episodeStore.current = ep)}
            >
              {ep.title}
            </button>
            <button
              onclick={() => seenStore.markUnseen(ep.id)}
              class="text-white/20 hover:text-sp-red text-xs shrink-0 transition-all opacity-0 group-hover:opacity-100"
              title="Remove from seen"
            >
              ✕
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
