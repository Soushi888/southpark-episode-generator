<script lang="ts">
  let { season, episode }: { season: number; episode: number } = $props()

  const label = $derived(
    `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`
  )
</script>

<span class="pill bg-sp-yellow/20 text-sp-yellow border border-sp-yellow/40 font-mono text-xs tracking-wider">
  {label}
</span>
