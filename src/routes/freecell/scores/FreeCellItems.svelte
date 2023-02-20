<script lang="ts">
	import type { Freecell } from '../../../lib/types/free-cell.type';
	import FreeCellItem from './FreeCellItem.svelte';

	export let items: Freecell[] = [];
</script>

<div class="free-cell-items">
	<div class="free-cell-header">
		<div class="user">User</div>
		<div class="status">Status</div>
		<div class="elapsed">Time</div>
		<div class="moves">Moves</div>
	</div>
	{#each items as item}
		<FreeCellItem {item} />
	{/each}
</div>

<style>
	div.free-cell-header {
		@apply flex flex-wrap justify-between mx-2 font-bold border-b-gray-500 border-dashed border mb-2 bg-gray-300 py-1 px-1;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.elapsed {
		@apply w-20 text-center;
	}
	div.moves {
		@apply w-20 text-right;
	}
</style>
