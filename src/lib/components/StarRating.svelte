<script lang="ts">
  let { rating }: { rating?: number } = $props()

  const filled = $derived(rating !== undefined ? Math.round(rating / 2) : 0)
  const empty = $derived(5 - filled)
</script>

{#if rating !== undefined}
  <div class="flex items-center gap-1" title="IMDb {rating}/10">
    {#each { length: filled } as _}
      <span class="text-sp-yellow text-sm">★</span>
    {/each}
    {#each { length: empty } as _}
      <span class="text-white/20 text-sm">★</span>
    {/each}
    <span class="text-white/40 text-xs ml-1">{rating}/10</span>
  </div>
{/if}
