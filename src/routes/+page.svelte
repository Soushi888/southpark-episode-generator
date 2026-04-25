<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { replaceState } from '$app/navigation'
  import { episodeStore } from '$lib/stores/episode.svelte'
  import { filterStore } from '$lib/stores/filters.svelte'
  import { seenStore } from '$lib/stores/seen.svelte'
  import { pickEpisode } from '$lib/picker'
  import { encodeFilters, decodeFilters } from '$lib/url-state'
  import type { Episode } from '$lib/types'
  import episodesData from '$lib/data/episodes.json'
  import EpisodeCard from '$lib/components/EpisodeCard.svelte'
  import RandomPicker from '$lib/components/RandomPicker.svelte'
  import FilterPanel from '$lib/components/FilterPanel.svelte'
  import EpisodeList from '$lib/components/EpisodeList.svelte'

  const allEpisodes = episodesData as Episode[]

  // Router isn't ready during the first $effect run (before onMount).
  // Once onMount fires, ready = true triggers $effect to re-run and
  // subsequent state changes sync the URL normally.
  let ready = $state(false)

  onMount(() => {
    const { episodeId, ...filters } = decodeFilters($page.url)
    filterStore.setFromState(filters)
    if (episodeId) {
      const found = allEpisodes.find((e) => e.id === episodeId)
      if (found) episodeStore.current = found
    }
    // Defer past SvelteKit's initialize() so the router is assigned before
    // the $effect below first calls replaceState.
    setTimeout(() => { ready = true }, 0)
  })

  $effect(() => {
    if (!ready) return
    const encoded = encodeFilters(filterStore.state, episodeStore.current?.id ?? null)
    const url = new URL(window.location.href)
    replaceState(encoded ? `${url.pathname}${encoded}` : url.pathname, {})
  })

  function handleSpin() {
    if (filterStore.filtered.length === 0 || episodeStore.spinning) return
    episodeStore.spinning = true
    const picked = pickEpisode(filterStore.filtered)
    episodeStore.current = picked
    seenStore.markSeen(picked.id)
    episodeStore.spinning = false
  }

  function handleKeydown(e: KeyboardEvent) {
    if (
      (e.code === 'Space' || e.code === 'Enter') &&
      !(e.target as Element)?.matches('input, button, textarea, [role="slider"]')
    ) {
      e.preventDefault()
      handleSpin()
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<main class="min-h-screen flex flex-col items-center px-4 py-12 gap-8 pb-48">
  <header class="text-center select-none">
    <h1 class="sp-logo text-6xl text-sp-yellow mb-1">🏔 SOUTH PARK</h1>
    <p class="sp-heading text-lg text-white/50 tracking-widest">RANDOM EPISODE GENERATOR</p>
  </header>

  <RandomPicker onSpin={handleSpin} />

  {#if episodeStore.current}
    <EpisodeCard episode={episodeStore.current} />
  {:else}
    <div class="card-base max-w-2xl w-full text-center py-12 text-white/30">
      <p class="text-5xl mb-4">🎲</p>
      <p class="font-semibold">Hit the button to discover a random episode</p>
      <p class="text-sm mt-1 text-white/20">or press Space</p>
    </div>
  {/if}

  <FilterPanel />

  <EpisodeList episodes={filterStore.filtered} />
</main>
