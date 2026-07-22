<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { replaceState } from '$app/navigation'
  import { episodeStore } from '$lib/stores/episode.svelte'
  import { filterStore } from '$lib/stores/filters.svelte'
  import { pickEpisode } from '$lib/picker'
  import { encodeFilters, decodeFilters } from '$lib/url-state'
  import type { Episode } from '$lib/types'
  import episodesData from '$lib/data/episodes.json'
  import EpisodeCard from '$lib/components/EpisodeCard.svelte'
  import RandomPicker from '$lib/components/RandomPicker.svelte'
  import FilterPanel from '$lib/components/FilterPanel.svelte'
  import EpisodeList from '$lib/components/EpisodeList.svelte'
  import SeenList from '$lib/components/SeenList.svelte'

  const allEpisodes = episodesData as Episode[]

  let ready = $state(false)
  let showBackToTop = $state(false)

  function onScroll() {
    showBackToTop = window.scrollY > 400
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMount(() => {
    const { episodeId, ...filters } = decodeFilters($page.url)
    filterStore.setFromState(filters)
    if (episodeId) {
      const found = allEpisodes.find((e) => e.id === episodeId)
      if (found) episodeStore.current = found
    }
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

<svelte:window onkeydown={handleKeydown} onscroll={onScroll} />

<main class="min-h-screen px-4 pt-10 pb-48">
  <header class="text-center select-none mb-10">
    <h1 class="sp-logo text-6xl text-sp-yellow mb-1">🏔 SOUTH PARK</h1>
    <p class="sp-heading text-lg text-white/50 tracking-widest">RANDOM EPISODE PICKER</p>
  </header>

  <div class="max-w-6xl mx-auto lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start flex flex-col items-center gap-8">
    <!-- Left: sticky picker + card -->
    <div class="w-full max-w-2xl flex flex-col gap-6 lg:sticky lg:top-8">
      <RandomPicker onSpin={handleSpin} />

      {#if episodeStore.current}
        <EpisodeCard episode={episodeStore.current} />
      {:else}
        <div class="card-base max-w-2xl w-full text-center py-14 text-white/50 flex flex-col items-center gap-4">
          <p class="text-6xl animate-bounce" style="animation-duration: 2s">🎲</p>
          <div>
            <p class="font-bold text-lg text-white/60">Spin the wheel</p>
            <p class="text-sm text-white/40 mt-1">{filterStore.count} episodes across 28 seasons<br>ready to be discovered</p>
          </div>
          <button class="btn-spin text-xl mt-2" onclick={handleSpin}>
            🎲 Pick an Episode
          </button>
        </div>
      {/if}
    </div>

    <!-- Right: filters + episode list -->
    <div class="w-full max-w-2xl flex flex-col gap-6">
      <FilterPanel />
      <SeenList />
      <EpisodeList episodes={filterStore.filtered} />
    </div>
  </div>
</main>

{#if showBackToTop}
  <button
    onclick={scrollToTop}
    class="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-sp-yellow text-sp-dark font-bold text-xl shadow-lg hover:scale-110 transition-transform"
    aria-label="Back to top"
  >
    ↑
  </button>
{/if}
