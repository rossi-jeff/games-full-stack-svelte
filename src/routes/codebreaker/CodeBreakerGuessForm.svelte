<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let available: string[] = [];
	export let columns: number = 4;
	let selected: string[] = [];
	let ready: boolean = false;

	const dispatch = createEventDispatcher();

	const checkReady = () => {
		if (!selected.length) {
			ready = false;
			return;
		}
		let valid: boolean = true;
		for (let color of selected) {
			if (!color.length) valid = false;
		}
		ready = valid;
	};

	const sendGuess = () => {
		dispatch('sendGuess', { selected });
		selected = [];
		for (let i = 0; i < columns; i++) selected.push('');
		checkReady();
	};
</script>

<div class="code-breaker-guess-form">
	{#each Array(columns) as _, i (i)}
		<div id="column-{i}" class="guess-color">
			<select name="selected-{i}" id="selected-{i}" bind:value={selected[i]} on:change={checkReady}>
				<option value="">- select -</option>
				{#each available as color}
					<option value={color} class={color}>{color}</option>
				{/each}
			</select>
		</div>
	{/each}
	<div class="controls">
		{#if ready}
			<button on:click={sendGuess}>Guess</button>
		{/if}
	</div>
</div>

<style>
	div.code-breaker-guess-form {
		@apply flex flex-wrap mx-2;
	}
	div.code-breaker-guess-form div {
		@apply py-1 mr-4;
	}
	.Black {
		@apply bg-black border-black text-white;
	}
	.Blue {
		@apply bg-blue-700 border-blue-900 text-white;
	}
	.Brown {
		@apply bg-amber-800 border-amber-900 text-white;
	}
	.Green {
		@apply bg-green-500 border-green-900;
	}
	.Orange {
		@apply bg-orange-400 border-orange-900;
	}
	.Purple {
		@apply bg-purple-600 border-purple-900;
	}
	.Red {
		@apply bg-red-600 border-red-900;
	}
	.White {
		@apply bg-white border-black;
	}
	.Yellow {
		@apply bg-yellow-300 border-yellow-900;
	}
	select {
		@apply border border-black rounded px-1 py-1;
	}
	button {
		@apply border border-black rounded px-1 py-1;
	}
	button:hover {
		@apply bg-blue-400;
	}
</style>
