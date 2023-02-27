<script lang="ts">
	import type { TenGrandTurn } from '../../lib/types/ten-grand-turn.type';
	import TenGrandTurnDisplay from './TenGrandTurnDisplay.svelte';

	export let turns: TenGrandTurn[] = [];
</script>

<div class="ten-grand-turns">
	<div class="ten-grand-turns-header">
		<div class="header-left">
			<div class="category">Category</div>
			<div class="dice">Dice</div>
			<div class="score">Score</div>
		</div>
		<div class="header-right">Total</div>
	</div>
	{#each turns as turn}
		<TenGrandTurnDisplay {turn} />
	{/each}
</div>

<style>
	div.ten-grand-turns {
		@apply mt-4 p-2;
	}
	div.ten-grand-turns-header {
		@apply flex flex-wrap  bg-blue-200 font-bold px-2;
	}
	div.header-left {
		@apply flex-grow flex flex-wrap justify-between;
	}
	div.category {
		@apply w-36;
	}
	div.dice {
		@apply w-24 text-center;
	}
	div.score {
		@apply w-24 text-right;
	}
	div.header-right {
		@apply w-36 text-right;
	}
</style>
