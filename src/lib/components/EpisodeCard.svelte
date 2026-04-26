<script lang="ts">
  import type { Episode } from '$lib/types'
  import { toWcoUrl } from '$lib/types'
  import { seenStore } from '$lib/stores/seen.svelte'
  import EpisodeBadge from './EpisodeBadge.svelte'
  import StarRating from './StarRating.svelte'
  import ShareButton from './ShareButton.svelte'

  let { episode }: { episode: Episode } = $props()

  const seen = $derived(seenStore.ids.has(episode.id))

  function toggleSeen() {
    if (seen) seenStore.markUnseen(episode.id)
    else seenStore.markSeen(episode.id)
  }
</script>

<div class="rounded-2xl bg-white/8 border border-white/10 shadow-xl shadow-black/40 border-l-4 border-l-sp-yellow p-6 w-full transition-all duration-300">
  <div class="flex items-start justify-between gap-4 mb-4">
    <div class="flex items-center gap-3 flex-wrap">
      <EpisodeBadge season={episode.season} episode={episode.episode} />
      {#if episode.airDate}
        <span class="text-white/30 text-xs">{episode.airDate}</span>
      {/if}
    </div>
    <ShareButton />
  </div>

  <h2 class="sp-heading text-3xl text-white mb-2 leading-tight">{episode.title}</h2>

  <StarRating rating={episode.imdbRating} />

  {#if episode.description}
    <p class="text-white/60 text-sm leading-relaxed mt-3 mb-4">{episode.description}</p>
  {/if}

  {#if episode.tags.length > 0}
    <div class="flex flex-wrap gap-2 mb-4">
      {#each episode.tags as tag}
        <span class="pill bg-white/5 text-white/50 border border-white/10 text-xs">{tag}</span>
      {/each}
    </div>
  {/if}

  {#if episode.characters.length > 0}
    <div class="flex flex-wrap gap-1 mb-5">
      {#each episode.characters as char}
        <span class="text-xs text-white/40 after:content-['·'] after:ml-1 last:after:content-['']">{char}</span>
      {/each}
    </div>
  {/if}

  <div class="flex flex-col gap-3 mt-2">
    <a
      href={toWcoUrl(episode.watchUrl)}
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center justify-center gap-2 w-full py-3 bg-sp-red hover:bg-sp-red/80 text-white rounded-xl transition-colors border-2 border-black/30 sp-heading text-xl tracking-wide"
    >
      ▶ WATCH NOW
    </a>
    <a
      href={episode.watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 rounded-xl transition-colors border border-white/10 text-sm font-semibold"
    >
      ▶ Watch on WCOFlix (fallback)
    </a>
    <button
      onclick={toggleSeen}
      class="w-full py-2 rounded-xl border transition-colors text-sm font-semibold {seen
        ? 'border-sp-yellow/40 text-sp-yellow/70 hover:text-sp-yellow hover:border-sp-yellow'
        : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/30'}"
    >
      {seen ? '✓ Marked as seen — click to undo' : '○ Mark as seen'}
    </button>
  </div>
</div>
