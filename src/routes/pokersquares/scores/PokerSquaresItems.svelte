<script lang="ts">
	import type { PokerSquare } from '$lib/types/poker-square.type';
	import PokerSquaresItem from './PokerSquaresItem.svelte';

	export let items: PokerSquare[] = [];
</script>

<div class="poker-squares-items">
	<div class="poker-squares-header">
		<div class="user">User</div>
		<div class="status">Status</div>
		<div class="score">Score</div>
	</div>
	{#each items as item}
		<PokerSquaresItem {item} />
	{/each}
</div>

<style>
	div.poker-squares-items {
		@apply mb-2 bg-white rounded mx-2 p-2;
	}
	div.poker-squares-header {
		@apply flex flex-wrap justify-between mx-2 font-bold border-b-gray-500 border-dashed border mb-2 bg-gray-300 py-1 px-1;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.score {
		@apply w-24;
	}
	div.score {
		@apply text-right;
	}
</style>
