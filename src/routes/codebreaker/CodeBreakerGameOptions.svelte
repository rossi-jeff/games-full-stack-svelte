<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Color } from '../../lib/enum/color.enum';

	const colors: string[] = Object.values(Color);
	const columns: number[] = [4, 5, 6, 7, 8];
	const selected: { Colors: string[]; Columns: number } = {
		Colors: [],
		Columns: 4
	};
	let all: boolean = false;
	let showButton: boolean = false;

	const dispatch = createEventDispatcher();

	const toggleAll = () => {
		all = !all;
		selected.Colors = all ? colors : [];
		checkVisible();
	};

	const checkVisible = () => {
		showButton = selected.Colors.length >= 2 ? true : false;
	};

	const startGame = () => {
		dispatch('startGame', selected);
		selected.Colors = [];
		selected.Columns = 4;
		all = false;
		checkVisible();
	};
</script>

<div class="code-breaker-options">
	<div class="colors-container">
		<div class="colors">
			<div class="White">
				<input type="checkbox" name="all" id="all" bind:checked={all} on:click={toggleAll} />
				<label for="all">Check All</label>
			</div>
			{#each colors as color}
				<div class={color}>
					<input
						type="checkbox"
						name="color-{color}"
						id="color-{color}"
						value={color}
						bind:group={selected.Colors}
						on:change={checkVisible}
					/>
					<label for="color-{color}">{color}</label>
				</div>
			{/each}
		</div>
	</div>
	<div class="columns-container">
		<select name="columns-select" id="columns-select" bind:value={selected.Columns}>
			{#each columns as column}
				<option value={column} selected={column === selected.Columns}>{column}</option>
			{/each}
		</select>
	</div>
	<div class="controls">
		{#if showButton}
			<button on:click={startGame}>Start Game</button>
		{/if}
	</div>
</div>

<style>
	div.code-breaker-options {
		@apply flex flex-wrap justify-between mx-2;
	}
	div.colors {
		@apply flex flex-wrap;
	}
	div.colors div {
		@apply mr-2 border border-black rounded px-2 py-1;
	}
	select {
		@apply border border-black rounded px-1 py-1;
	}
	button {
		@apply border border-black rounded px-1 py-1;
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
	button:hover {
		@apply bg-blue-400;
	}
</style>
