<script lang="ts">
  import { filterStore } from '$lib/stores/filters.svelte'
  import { MAX_SEASON } from '$lib/types'

  function onMinInput(e: Event) {
    const v = Math.min(Number((e.target as HTMLInputElement).value), filterStore.seasonRange[1] - 1)
    filterStore.seasonRange = [v, filterStore.seasonRange[1]]
  }

  function onMaxInput(e: Event) {
    const v = Math.max(Number((e.target as HTMLInputElement).value), filterStore.seasonRange[0] + 1)
    filterStore.seasonRange = [filterStore.seasonRange[0], v]
  }
</script>

<div class="flex flex-col gap-3">
  <div class="flex justify-between text-xs text-white/50">
    <span>Season {filterStore.seasonRange[0]}</span>
    <span>Season {filterStore.seasonRange[1]}</span>
  </div>
  <div class="flex flex-col gap-2">
    <input
      type="range"
      min={1}
      max={MAX_SEASON}
      value={filterStore.seasonRange[0]}
      oninput={onMinInput}
      class="w-full accent-sp-yellow cursor-pointer"
    />
    <input
      type="range"
      min={1}
      max={MAX_SEASON}
      value={filterStore.seasonRange[1]}
      oninput={onMaxInput}
      class="w-full accent-sp-yellow cursor-pointer"
    />
  </div>
</div>
