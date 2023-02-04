<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let Min = 6;
	export let Max = 12;
	const lengths = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

	const dispatch = createEventDispatcher();

	const checkValid = () => {
		if (Min > Max) Max = Min;
	};

	const newGame = () => {
		dispatch('newGame', { Min, Max });
	};
</script>

<div class="hang-man-game-options">
	<div>
		<label for="min">Min</label>
		<select name="min" id="min" bind:value={Min} on:change={checkValid}>
			{#each lengths as l}
				<option value={l} selected={l === Min}>{l}</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="max">Max</label>
		<select name="max" id="max" bind:value={Max} on:change={checkValid}>
			{#each lengths as l}
				<option value={l} selected={l === Max}>{l}</option>
			{/each}
		</select>
	</div>
	<div>
		<button on:click={newGame}>New Game</button>
	</div>
</div>

<style>
	div.hang-man-game-options {
		@apply flex flex-wrap mx-2;
	}
	div.hang-man-game-options div {
		@apply mr-4;
	}
	button,
	select {
		@apply border border-black rounded px-1 py-1;
	}
	button:hover {
		@apply bg-blue-400;
	}
</style>
