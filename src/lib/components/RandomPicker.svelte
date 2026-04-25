<script lang="ts">
    import { filterStore } from "$lib/stores/filters.svelte";
    import { episodeStore } from "$lib/stores/episode.svelte";

    let { onSpin }: { onSpin: () => void } = $props();
</script>

<div class="flex flex-col items-center gap-3">
    <button
        class="btn-spin"
        class:animate-pulse={episodeStore.spinning}
        disabled={episodeStore.spinning || filterStore.count === 0}
        onclick={onSpin}
    >
        {#if filterStore.count === 0}
            😬 No Episodes Match
        {:else}
            🎲 Random Episode
        {/if}
    </button>

    <p class="text-white/30 text-sm">
        {filterStore.count} episode{filterStore.count !== 1 ? "s" : ""} available
        · Press
        <kbd
            class="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs border border-white/20"
            >Space</kbd
        > to spin
    </p>
</div>
