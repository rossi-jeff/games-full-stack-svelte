<script lang="ts">
	import type { YachtTurn } from '$lib/types/yacht-turn.type';

	export let turns: YachtTurn[] = [];
	export let total: number;
</script>

<div class="yacht-score-card">
	<h2>Score Card</h2>
	<div class="turns">
		{#each turns as turn}
			<div class="turn">
				<div class="category">{turn.Category}</div>
				<div class="score">{turn.Score ?? 0}</div>
			</div>
		{/each}
		<div class="turn">
			<div class="category">Total</div>
			<div class="score">{total}</div>
		</div>
	</div>
</div>

<style>
	div.yacht-score-card {
		@apply border border-black rounded p-2 bg-white;
	}
	div.turn {
		@apply flex flex-wrap py-1 border border-dashed border-b-gray-500;
	}
	div.category {
		@apply grow;
	}
	h2 {
		@apply font-bold text-lg mb-2;
	}
</style>
