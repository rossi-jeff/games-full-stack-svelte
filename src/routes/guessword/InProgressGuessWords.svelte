<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { GuessWord } from '../../lib/types/guess-word.type';

	export let inProgress: GuessWord[] = [];

	const dispatch = createEventDispatcher();

	const continueGame = (id: number | undefined) => {
		dispatch('continueGame', { id });
	};
</script>

<div class="in-progress-guess-words">
	<h2>In Progress Games</h2>
	<div class="guess-words-list">
		<div class="guess-words-header">
			<div class="button" />
			<div class="length">Length</div>
			<div class="guesses">Guesses</div>
			<div class="date">Date</div>
		</div>
		{#each inProgress as guess_word}
			<div class="guess-word">
				<div class="button">
					{#if guess_word.id}
						<button on:click={() => continueGame(guess_word.id)}> Continue </button>
					{/if}
				</div>
				<div class="length">
					{guess_word.word ? guess_word.word.Length : 0}
				</div>
				<div class="guesses">
					{guess_word.guesses ? guess_word.guesses.length : 0}
				</div>
				<div class="date">
					{#if guess_word.created_at}
						{guess_word.created_at.toString().split('T')[0]}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	div.in-progress-guess-words {
		@apply mt-4;
	}
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.guess-words-list {
		@apply bg-white p-2 rounded mx-2;
	}
	div.guess-words-header {
		@apply flex flex-wrap justify-between  bg-blue-300 font-bold px-1;
	}
	div.guess-word {
		@apply flex flex-wrap mx-2 justify-between border border-dashed border-b-gray-400;
	}
	div.button {
		@apply w-20;
	}
	div.length,
	div.guesses {
		@apply w-12 text-center;
	}
	div.date {
		@apply w-32 text-right;
	}
	button {
		@apply border border-black rounded px-1 py-0 my-1 bg-white;
	}
	button:hover {
		@apply bg-blue-400;
	}
</style>
