<script lang="ts">
  import { filterStore } from '$lib/stores/filters.svelte'
  import type { EpisodeTag } from '$lib/types'

  const ALL_TAGS: EpisodeTag[] = [
    'classic', 'controversial', 'cartman-centric', 'kenny-dies',
    'randy-centric', 'butters-centric', 'movie-length', 'season-finale',
    'holiday', 'celebrity-parody', 'meta', 'trilogy'
  ]

  function toggleTag(tag: EpisodeTag) {
    filterStore.tags = filterStore.tags.includes(tag)
      ? filterStore.tags.filter((t) => t !== tag)
      : [...filterStore.tags, tag]
  }
</script>

<div class="flex flex-wrap gap-1.5">
  {#each ALL_TAGS as tag}
    {@const active = filterStore.tags.includes(tag)}
    <button
      onclick={() => toggleTag(tag)}
      class="pill text-xs border cursor-pointer transition-all {active
        ? 'bg-sp-yellow text-black border-yellow-400 font-black'
        : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'}"
    >
      {tag}
    </button>
  {/each}
</div>
