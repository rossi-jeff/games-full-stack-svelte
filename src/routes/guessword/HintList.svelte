<script lang="ts">
	export let hints: string[] = [];
</script>

<div class="hint-list">
	{#each hints as hint}
		<div class="hint">{hint.toUpperCase()}</div>
	{/each}
</div>

<style>
	div.hint-list {
		@apply mx-2 flex flex-wrap max-h-32 overflow-y-auto;
	}
	div.hint {
		@apply mr-4 mb-2;
	}
</style>
