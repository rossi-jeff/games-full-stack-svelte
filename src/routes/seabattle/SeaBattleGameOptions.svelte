<script lang="ts">
	import { ShipType } from '$lib/enum/ship-type.enum';
	import { createEventDispatcher, onMount } from 'svelte';
	export let flag: boolean = false;

	let Axis: number = 8;
	let shipTypes = Object.values(ShipType);
	type shipQuantity = { [key: string]: number };
	let ships: shipQuantity = {};
	const perType: number[] = [0, 1, 2, 3];
	const axes: number[] = [6, 8, 10, 12];

	const dispatch = createEventDispatcher();

	const initialShips = () => {
		for (const shiptype of shipTypes) ships[shiptype] = 1;
	};

	onMount(() => {
		initialShips();
	});

	const newGame = () => {
		dispatch('newGame', { Axis, ships });
	};
</script>

<div class="sea-battle-game-options">
	<div>
		<label for="axis">Axis</label>
		<select name="axis" id="axis" bind:value={Axis}>
			{#each axes as a}
				<option value={a} selected={a === Axis}>{a}</option>
			{/each}
		</select>
	</div>
	{#each shipTypes as shipType}
		<div class="ship-qty">
			<label for="qty-{shipType}">{shipType}</label>
			<select name="qty-{shipType}" id="qty-{shipType}" bind:value={ships[shipType]}>
				{#each perType as p}
					<option value={p} selected={p === ships[shipType]}>{p}</option>
				{/each}
			</select>
		</div>
	{/each}
	<div>
		<button on:click={newGame} disabled={flag}>New Game</button>
	</div>
</div>

<style>
	div.sea-battle-game-options {
		@apply mx-2;
	}
	div.sea-battle-game-options div {
		@apply border-b-gray-500 border-dashed border py-1 mb-1;
	}
	select,
	button {
		@apply border border-black rounded py-1 px-2;
	}
	button:hover {
		@apply bg-blue-400;
	}
	label {
		@apply font-bold w-24 inline-block;
	}
</style>
