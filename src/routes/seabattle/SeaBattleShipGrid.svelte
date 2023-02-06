<script lang="ts">
	import { MaxAxis } from '$lib/sea-battle-functions';
	import { createEventDispatcher } from 'svelte';
	import type { SeaBattleShip } from '../../lib/types/sea-batte-ship.type';
	import type { SeaBattleTurn } from '../../lib/types/sea-battle-turn.type';

	export let axis: number = 8;
	export let flag: boolean = false;
	const horizontal = MaxAxis.H.slice(0, axis);
	const vertical = MaxAxis.V.slice(0, axis);
	let occupied: string[] = [];

	const dispatch = createEventDispatcher();

	export const displayShips = (ships: SeaBattleShip[]) => {
		occupied = [];
		let el, cellId;
		for (const ship of ships) {
			if (ship.gridPoints) {
				for (const point of ship.gridPoints) {
					cellId = `s-${point.Horizontal}-${point.Vertical}`;
					el = document.getElementById(cellId);
					if (el) {
						el.classList.add('occupied');
						occupied.push(cellId);
					}
				}
			}
		}
	};

	export const displayTurns = (turns: SeaBattleTurn[]) => {
		let el, cellId, point;
		for (const turn of turns) {
			if (turn.gridPoint && turn.Target) {
				point = turn.gridPoint;
				cellId = `s-${point.Horizontal}-${point.Vertical}`;
				el = document.getElementById(cellId);
				if (el) {
					el.classList.add(turn.Target);
				}
			}
		}
	};

	const nextTurn = () => {
		dispatch('nextTurn');
	};

	const fire = () => {
		dispatch('fire');
	};
</script>

<h2>Opponent Turn</h2>

<div class="ship-grid">
	<div class="top-header">
		<div />
		{#each horizontal as h}
			<div>{h}</div>
		{/each}
	</div>
	{#each vertical as v}
		<div class="grid-row" id="row-{v}">
			<div class="left-header">{v}</div>
			{#each horizontal as h}
				<div id="s-{h}-{v}">
					<span />
				</div>
			{/each}
		</div>
	{/each}
</div>

<div class="controls">
	{#if flag}
		<button on:click={nextTurn}>Player Turn</button>
	{:else}
		<button on:click={fire}>Opponent Fire</button>
	{/if}
</div>

<style>
	div.ship-grid {
		@apply flex flex-col mb-4 mx-2;
	}
	div.top-header {
		@apply flex;
	}
	div.top-header div {
		@apply h-10 w-10 border border-dotted border-blue-900 font-bold text-center bg-blue-700 pt-2;
	}
	div.grid-row {
		@apply flex;
	}
	div.left-header {
		@apply h-10 w-10 border border-dotted border-blue-900 bg-blue-700 font-bold text-center pt-2;
	}
	div.grid-row div {
		@apply h-10 w-10 border border-dotted border-gray-500 pt-1 text-center;
	}
	button {
		@apply border border-black rounded py-1 px-2;
	}
	button:hover {
		@apply bg-blue-400;
	}
	:global(.occupied) {
		@apply bg-gray-400;
	}
	:global(div.Hit span),
	:global(div.Sunk span) {
		@apply w-7 h-7 rounded-full bg-red-400 inline-block;
	}
	:global(div.Miss span) {
		@apply w-7 h-7 rounded-full bg-blue-400 inline-block;
	}
	div.controls {
		@apply mx-2;
	}
	h2 {
		@apply font-bold text-lg mx-2 mb-2;
	}
</style>
