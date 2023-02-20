<script lang="ts">
	import type { Klondike } from '../../../lib/types/klondike.type';
	import KlondikeItem from './KlondikeItem.svelte';

	export let items: Klondike[] = [];
</script>

<div class="klondike-items">
	<div class="klondike-header">
		<div class="user">User</div>
		<div class="status">Status</div>
		<div class="elapsed">Time</div>
		<div class="moves">Moves</div>
	</div>
	{#each items as item}
		<KlondikeItem {item} />
	{/each}
</div>

<style>
	div.klondike-header {
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
