<script lang="ts">
  import { filterStore } from '$lib/stores/filters.svelte'
  import { TOP_CHARACTERS } from '$lib/types'

  function toggle(char: string) {
    filterStore.characters = filterStore.characters.includes(char)
      ? filterStore.characters.filter((c) => c !== char)
      : [...filterStore.characters, char]
  }
</script>

<div class="flex flex-col gap-1.5">
  {#each TOP_CHARACTERS as char}
    {@const active = filterStore.characters.includes(char)}
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={active}
        onchange={() => toggle(char)}
        class="w-3.5 h-3.5 accent-sp-yellow rounded"
      />
      <span class="text-sm transition-colors {active ? 'text-white font-semibold' : 'text-white/50'}">
        {char}
      </span>
    </label>
  {/each}
</div>
