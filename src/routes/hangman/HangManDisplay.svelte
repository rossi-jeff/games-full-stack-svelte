<script lang="ts">
	export let display: string[] = [];
</script>

<div class="hang-man-display">
	{#each display as letter}
		<div>{letter ?? ''}</div>
	{/each}
</div>

<style>
	div.hang-man-display {
		@apply flex flex-wrap mx-2 my-4;
	}
	div.hang-man-display div {
		@apply border border-b-black w-8 h-8 mr-2 text-center;
	}
</style>
