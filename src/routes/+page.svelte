<script lang="ts">
  import { adBlockEnabled } from "$lib/stores/adblock.store";
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>

{#if $adBlockEnabled === null}
  <div class="loading">Checking for ad blockers...</div>
{:else if $adBlockEnabled}
  <div class="warning">Please disable your ad blocker to continue</div>
{:else}
  <!-- Show your ads or regular content -->
{/if}