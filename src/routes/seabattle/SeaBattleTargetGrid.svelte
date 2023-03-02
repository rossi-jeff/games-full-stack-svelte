<script lang="ts">
	import { MaxAxis } from '$lib/sea-battle-functions';
	import { createEventDispatcher, onMount } from 'svelte';
	import { GameStatus } from '../../lib/enum/game-status.enum';
	import type { SeaBattleShip } from '../../lib/types/sea-batte-ship.type';
	import type { SeaBattleTurn } from '../../lib/types/sea-battle-turn.type';
	import ShipDisplay from './ShipDisplay.svelte';

	export let axis: number = 8;
	export let flag: boolean = false;
	export let status: GameStatus = GameStatus.Playing;
	const horizontal = MaxAxis.H.slice(0, axis);
	const vertical = MaxAxis.V.slice(0, axis);

	type TargetType = { Horizontal?: string; Vertical?: number };
	let target: TargetType = {};
	let highlighted: string | undefined = undefined;
	let opponentShips: SeaBattleShip[] = [];

	const dispatch = createEventDispatcher();

	export const reset = () => {
		target.Horizontal = horizontal[0];
		target.Vertical = vertical[0];
		highLightTarget();
	};

	const highLightTarget = () => {
		let el;
		if (highlighted) {
			el = document.getElementById(highlighted);
			if (el) el.classList.remove('highlight');
		}
		highlighted = `t-${target.Horizontal}-${target.Vertical}`;
		el = document.getElementById(highlighted);
		if (el) el.classList.add('highlight');
	};

	export const displayTurns = (turns: SeaBattleTurn[]) => {
		let el, cellId, point;
		for (const turn of turns) {
			if (turn.gridPoint && turn.Target) {
				point = turn.gridPoint;
				cellId = `t-${point.Horizontal}-${point.Vertical}`;
				el = document.getElementById(cellId);
				if (el) {
					el.classList.add(turn.Target);
				}
			}
		}
	};

	export const displayShips = (ships: SeaBattleShip[]) => {
		opponentShips = ships;
	};

	const nextTurn = () => {
		dispatch('nextTurn');
	};

	const fire = () => {
		dispatch('fire', target);
		reset();
	};

	onMount(() => {
		reset();
	});
</script>

<h2>Player Turn</h2>

<div class="target-grid">
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
				<div id="t-{h}-{v}">
					<span />
				</div>
			{/each}
		</div>
	{/each}
</div>

<div class="ship-icons">
	{#each opponentShips as ship}
		<ShipDisplay {ship} />
	{/each}
</div>

{#if status === GameStatus.Playing}
	<div class="controls">
		{#if flag}
			<button on:click={nextTurn}>Opponent Turn</button>
		{:else}
			<div class="selects">
				<div>
					<label for="horizontal">Horizontal</label>
					<select
						name="horizontal"
						id="horizontal"
						bind:value={target.Horizontal}
						on:change={highLightTarget}
					>
						{#each horizontal as h}
							<option value={h}>{h}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="vertical">Vertical</label>
					<select
						name="vertical"
						id="vertical"
						bind:value={target.Vertical}
						on:change={highLightTarget}
					>
						{#each vertical as v}
							<option value={v}>{v}</option>
						{/each}
					</select>
				</div>
				<div>
					<button on:click={fire}>Fire</button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	div.target-grid {
		@apply flex flex-col mb-4 mx-2 bg-white max-w-fit;
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
		@apply h-10 w-10 border border-dotted border-gray-500 text-center pt-1;
	}
	div.selects {
		@apply flex flex-wrap;
	}
	div.selects div {
		@apply mr-4;
	}
	select,
	button {
		@apply border border-black rounded py-1 px-2 bg-white;
	}
	button:hover {
		@apply bg-blue-400;
	}
	label {
		@apply font-bold inline-block mr-2;
	}
	:global(.highlight) {
		@apply bg-yellow-100;
	}
	:global(div.Hit span),
	:global(div.Sunk span) {
		@apply w-7 h-7 rounded-full bg-red-400 inline-block;
	}
	:global(div.Miss span) {
		@apply w-7 h-7 rounded-full bg-blue-400 inline-block;
	}
	div.ship-icons {
		@apply flex flex-wrap mx-2;
	}
	div.controls {
		@apply mx-2;
	}
	h2 {
		@apply font-bold text-lg mx-2 mb-2;
	}
</style>
