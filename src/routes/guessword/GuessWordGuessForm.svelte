<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let Length: number = 5;
	let letters: string[] = [];
	let ready: boolean = false;

	const dispatch = createEventDispatcher();

	const checkReady = () => {
		if (!letters.length) {
			ready = false;
			return;
		}
		let valid: boolean = true;
		for (let i = 0; i < Length; i++) {
			if (!letters[i] || !letters[i].length) valid = false;
		}
		ready = valid;
	};

	const sendGuess = () => {
		dispatch('sendGuess', { Guess: letters.join('').toLowerCase() });
		letters = [];
		checkReady();
	};

	const focusNext = (event: any) => {
		const {
			target: { id },
			key
		} = event;
		if (id && key && key.length === 1) {
			checkReady();
			const ids = [];
			for (let i = 0; i < Length; i++) ids.push(`letter-${i}`);
			let idx = ids.indexOf(id);
			let el;
			if (idx != -1) {
				let nextId = ids[idx + 1];
				if (nextId) {
					el = document.getElementById(nextId);
					if (el) el.focus();
				} else if (idx === Length - 1) {
					el = document.getElementById(ids[idx]);
					if (el) el.blur();
				}
			}
		}
	};
</script>

<div class="guess-word-guess-form">
	<div class="letter-inputs">
		{#each Array(Length) as _, i (i)}
			<div id="input-{i}">
				<input
					type="text"
					name="letter-{i}"
					id="letter-{i}"
					bind:value={letters[i]}
					class="single"
					maxlength="1"
					on:keyup={focusNext}
				/>
			</div>
		{/each}
	</div>
	<div class="controls">
		{#if ready}
			<button id="guess-button" on:click={sendGuess}>Guess</button>
		{/if}
	</div>
</div>

<style>
	div.guess-word-guess-form {
		@apply mx-2 flex flex-wrap mb-4;
	}
	div.letter-inputs {
		@apply flex flex-wrap mr-4;
	}
	input.single {
		@apply border border-blue-800 bg-blue-200 rounded text-black h-8 w-8 mr-2 text-center;
	}
	button {
		@apply border border-black rounded px-1 py-1;
	}
	button:hover {
		@apply bg-blue-400;
	}
</style>
