<script lang="ts">
	import { alphabet } from '$lib/alphabet';
	import { createEventDispatcher } from 'svelte';

	const letters: string[] = alphabet.toUpperCase().split('');

	const dispatch = createEventDispatcher();

	const guess = (letter: string) => {
		dispatch('guess', { Letter: letter.toLowerCase() });
	};

	export const clearButtons = () => {
		for (const letter of letters) {
			const button = document.getElementById(`button-${letter}`) as HTMLInputElement | null;
			if (button) {
				button.disabled = false;
				button.classList.remove('Correct');
				button.classList.remove('Wrong');
			}
		}
	};

	export const toggleButton = (letter: string, className: string) => {
		const button = document.getElementById(
			`button-${letter.toUpperCase()}`
		) as HTMLInputElement | null;
		if (button) {
			button.disabled = true;
			button.classList.add(className);
		}
	};
</script>

<div class="hang-man-letter-buttons">
	{#each letters as letter}
		<button on:click={() => guess(letter)} id="button-{letter}">
			{letter}
		</button>
	{/each}
</div>

<style>
	div.hang-man-letter-buttons {
		@apply flex flex-wrap mx-2;
	}
	button {
		@apply border border-black rounded py-1 px-2 mr-2 mb-2 bg-white;
	}
	button:hover {
		@apply bg-blue-400;
	}
	:global(.Correct) {
		background-color: lightgreen !important;
		border: solid darkgreen !important;
	}
	:global(.Wrong) {
		background-color: lightcoral !important;
		border: solid darkred !important;
	}
</style>
