<script lang="ts">
  let copied = $state(false)

  async function copy() {
    await navigator.clipboard.writeText(window.location.href)
    copied = true
    setTimeout(() => { copied = false }, 2000)
  }
</script>

<button
  onclick={copy}
  class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-all text-sm"
  title="Copy shareable link"
>
  {#if copied}
    <span>✓</span>
    <span>Copied!</span>
  {:else}
    <span>🔗</span>
    <span>Share</span>
  {/if}
</button>
