<script lang="ts">
	import type { GuessWordGuess } from '../../lib/types/guess-word-guess.type';

	export let guesses: GuessWordGuess[] = [];
</script>

<div class="guess-word-guess-list">
	{#each guesses as guess}
		<div class="guess-word-guess">
			{#if guess.ratings && guess.Guess}
				{#each guess.ratings as rating, idx}
					<div class={rating.Rating}>
						{guess.Guess[idx]}
					</div>
				{/each}
			{/if}
		</div>
	{/each}
</div>

<style>
	div.guess-word-guess-list {
		@apply mx-2 bg-white rounded p-2 mb-4;
	}
	div.guess-word-guess {
		@apply flex flex-wrap mb-2;
	}
	div.guess-word-guess div {
		@apply h-8 w-8 border rounded mr-2 text-center;
	}
	.Green {
		@apply bg-green-300 border-green-800;
	}
	.Gray {
		@apply bg-gray-300 border-gray-800;
	}
	.Brown {
		@apply bg-amber-400 border-amber-900;
	}
</style>
