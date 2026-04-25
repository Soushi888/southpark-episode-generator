<script lang="ts">
  import 'virtual:uno.css'
  import '@unocss/reset/tailwind.css'
  import '../app.css'

  let { children } = $props()
</script>

{@render children()}
