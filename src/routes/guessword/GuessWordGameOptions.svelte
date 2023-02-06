<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let Length: number = 5;
	const lengths: number[] = [4, 5, 6, 7, 8];

	const dispatch = createEventDispatcher();

	const newGame = () => {
		dispatch('newGame', { Length });
	};
</script>

<div class="guess-word-game-options">
	<h2>Game Options</h2>
	<div class="options-container">
		<div>
			<label for="lengths">Length</label>
			<select name="lengths" id="lengths" bind:value={Length}>
				{#each lengths as length}
					<option value={length} selected={length === Length}>{length}</option>
				{/each}
			</select>
		</div>
		<div>
			<button on:click={newGame}>New Game</button>
		</div>
	</div>
</div>

<style>
	h2 {
		@apply font-bold text-base mb-2;
	}
	div.guess-word-game-options {
		@apply mx-2 my-4;
	}
	div.options-container {
		@apply flex flex-wrap;
	}
	div.options-container div {
		@apply mr-4;
	}
	select,
	button {
		@apply border border-black rounded px-2 py-1;
	}
	label {
		@apply font-bold;
	}
	button:hover {
		@apply bg-blue-400;
	}
</style>
