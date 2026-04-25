<script lang="ts">
    import { filterStore, defaultFilters } from "$lib/stores/filters.svelte";
    import { seenStore } from "$lib/stores/seen.svelte";
    import SeasonRangeSlider from "./SeasonRangeSlider.svelte";
    import CharacterFilter from "./CharacterFilter.svelte";
    import TagFilter from "./TagFilter.svelte";

    let open = $state(false);

    const hasActiveFilters = $derived(
        filterStore.seasonRange[0] !== defaultFilters.seasonRange[0] ||
            filterStore.seasonRange[1] !== defaultFilters.seasonRange[1] ||
            filterStore.characters.length > 0 ||
            filterStore.tags.length > 0 ||
            filterStore.excludeSeen,
    );

    function toggleExcludeSeen(e: Event) {
        filterStore.excludeSeen = (e.target as HTMLInputElement).checked;
    }
</script>

<div class="w-full max-w-2xl">
    <button
        onclick={() => (open = !open)}
        class="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-2 w-full"
    >
        <span class="transform transition-transform {open ? 'rotate-90' : ''}"
            >▶</span
        >
        <span class="sp-heading tracking-widest uppercase text-xs">Filters</span
        >
        {#if hasActiveFilters}
            <span
                class="pill bg-sp-yellow/20 text-sp-yellow border border-sp-yellow/30 text-xs"
                >active</span
            >
        {/if}
        <span class="ml-auto text-white/30 text-xs"
            >{filterStore.count} episodes</span
        >
    </button>

    {#if open}
        <div class="card-base flex flex-col gap-6">
            <div>
                <p
                    class="sp-heading text-xs text-white/40 uppercase tracking-wider mb-3"
                >
                    Season Range
                </p>
                <SeasonRangeSlider />
            </div>

            <div>
                <p
                    class="sp-heading text-xs text-white/40 uppercase tracking-wider mb-3"
                >
                    Tags
                </p>
                <TagFilter />
            </div>

            <div>
                <p
                    class="sp-heading text-xs text-white/40 uppercase tracking-wider mb-3"
                >
                    Characters
                </p>
                <CharacterFilter />
            </div>

            <div
                class="flex items-center justify-between pt-2 border-t border-white/10"
            >
                <label
                    class="flex items-center gap-2 cursor-pointer text-sm text-white/60 hover:text-white transition-colors"
                >
                    <input
                        type="checkbox"
                        checked={filterStore.excludeSeen}
                        onchange={toggleExcludeSeen}
                        class="accent-sp-yellow"
                    />
                    Exclude seen episodes
                </label>

                {#if hasActiveFilters}
                    <button
                        onclick={() => filterStore.reset()}
                        class="text-xs text-white/40 hover:text-white/70 transition-colors underline"
                    >
                        Reset
                    </button>
                {/if}
            </div>

            {#if filterStore.excludeSeen}
                <button
                    onclick={() => seenStore.reset()}
                    class="text-xs text-sp-red/60 hover:text-sp-red transition-colors text-left"
                >
                    Clear seen history
                </button>
            {/if}
        </div>
    {/if}
</div>
