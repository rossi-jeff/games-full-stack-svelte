<script lang="ts">
	import type { TenGrandTurn } from '../../lib/types/ten-grand-turn.type';
	import SmallDieFace from './scores/SmallDieFace.svelte';

	export let turn: TenGrandTurn = {};
</script>

<div class="ten-grand-turn-display">
	<div class="ten-grand-scores-list">
		{#if turn.scores}
			{#each turn.scores as score}
				<div class="ten-grand-score" id="score-{score.Id}">
					<div class="category">{score.Category}</div>
					<div class="dice">
						{#if score.Dice}
							{#each score.Dice.split(',') as face}
								<SmallDieFace face={parseInt(face)} />
							{/each}
						{/if}
					</div>
					<div class="score">{score.Score}</div>
				</div>
			{/each}
		{/if}
	</div>
	<div class="ten-grand-turn-score">
		{turn.Score ? turn.Score : 0}
	</div>
</div>

<style>
	div.ten-grand-turn-display {
		@apply flex flex-wrap border border-dashed border-b-gray-500 px-2;
	}
	div.ten-grand-turn-score {
		@apply w-36 text-right;
	}
	div.ten-grand-scores-list {
		@apply flex-grow mb-2;
	}
	div.ten-grand-score {
		@apply flex flex-wrap justify-between border border-dotted border-b-gray-400 px-2;
	}
	div.category {
		@apply w-36;
	}
	div.dice {
		@apply w-36 text-center;
	}
	div.score {
		@apply w-24 text-right;
	}
</style>
