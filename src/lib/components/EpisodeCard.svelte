<script lang="ts">
  import type { Episode } from '$lib/types'
  import EpisodeBadge from './EpisodeBadge.svelte'
  import StarRating from './StarRating.svelte'
  import ShareButton from './ShareButton.svelte'

  let { episode }: { episode: Episode } = $props()
</script>

<div class="card-base max-w-2xl w-full border-sp-yellow/20 transition-all duration-300">
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

  <a
    href={episode.watchUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 px-5 py-2.5 bg-sp-red hover:bg-sp-red/80 text-white font-black rounded-xl transition-colors border-2 border-black/30 sp-heading text-lg tracking-wide"
  >
    ▶ WATCH NOW
  </a>
</div>
