<script lang="ts">
	import type { Concentration } from '../../../lib/types/concentration.type';
	import ConcentrationItem from './ConcentrationItem.svelte';

	export let items: Concentration[] = [];
</script>

<div class="concentration-items">
	<div class="concentration-header">
		<div class="user">User</div>
		<div class="status">Status</div>
		<div class="elapsed">Time</div>
		<div class="moves">Moves</div>
		<div class="matched">Match</div>
	</div>
	{#each items as item}
		<ConcentrationItem {item} />
	{/each}
</div>

<style>
	div.concentration-header {
		@apply flex flex-wrap justify-between mx-2 font-bold border-b-gray-500 border-dashed border mb-2 bg-gray-300 py-1 px-1;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.elapsed,
	div.moves {
		@apply w-20 text-center;
	}
	div.matched {
		@apply w-20 text-right;
	}
</style>
