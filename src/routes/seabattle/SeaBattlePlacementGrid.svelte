<script lang="ts">
	import { ShipDirections, ShipTypeLength } from '$lib/enum/ship-type.enum';
	import { MaxAxis } from '$lib/sea-battle-functions';
	import type { SeaBattleShip } from '$lib/types/sea-batte-ship.type';
	import { createEventDispatcher, onMount } from 'svelte';

	export let shipsToPlace: string[] = [];
	export let axis: number = 8;
	const horizontal = MaxAxis.H.slice(0, axis);
	const vertical = MaxAxis.V.slice(0, axis);

	type shipPlaceType = {
		shipType?: string;
		size?: number;
		points?: { h: string; v: number }[];
	};
	let ship: shipPlaceType = {};
	type startPositionType = {
		horizontal?: string;
		vertical?: number;
		direction?: string;
	};
	let start: startPositionType = {};
	let placementErrors: string[] = [];
	let occupied: string[] = [];
	let highlighted: string[] = [];

	const dispatch = createEventDispatcher();

	const setShipSize = () => {
		if (!ship.shipType) return;
		ship.size = ShipTypeLength[ship.shipType];
		highLightShip();
	};

	export const reset = () => {
		if (!shipsToPlace.length) return;
		// ship
		ship.shipType = shipsToPlace[0];
		ship.points = [];
		// start
		start.horizontal = horizontal[0];
		start.vertical = vertical[0];
		start.direction = ShipDirections[0];
		setShipSize();
	};

	const highLightShip = () => {
		if (!start.horizontal || !start.vertical || !start.direction) {
			if (!start.horizontal) placementErrors.push('Horizonal is not set');
			if (!start.vertical) placementErrors.push('Vertical is not set');
			if (!start.direction) placementErrors.push('Direction is not set');
			return;
		}
		if (!ship.shipType || !ship.size) {
			if (!ship.shipType) placementErrors.push('Ship type is not set');
			if (!ship.size) placementErrors.push('Ship size is not set');
			return;
		}
		clearHighLight();
		placementErrors = [];
		let idxH = horizontal.indexOf(start.horizontal);
		let idxV = vertical.indexOf(start.vertical);
		let direction = start.direction;
		let cellId, el, h, v;
		let remaining = ship.size;
		while (remaining > 0) {
			h = horizontal[idxH];
			v = vertical[idxV];
			if (!v || !h) {
				placementErrors.push('Ship extends beyond grid borders');
				break;
			}
			cellId = `p-${h}-${v}`;
			if (occupied.includes(cellId)) {
				placementErrors.push('Ship overlaps with another ship');
			}
			el = document.getElementById(cellId);
			if (el) {
				el.classList.add('highlight');
				highlighted.push(cellId);
			}
			switch (direction) {
				case 'right':
					idxH++;
					break;
				case 'down':
					idxV++;
					break;
				case 'left':
					idxH--;
					break;
				case 'up':
					idxV--;
					break;
			}
			remaining--;
		}
	};

	const clearHighLight = () => {
		let cellId, el;
		while (highlighted.length) {
			cellId = highlighted.pop();
			if (cellId) {
				el = document.getElementById(cellId);
				if (el) el.classList.remove('highlight');
			}
		}
	};

	const placeShip = () => {
		let cellId, el;
		ship.points = [];
		while (highlighted.length) {
			cellId = highlighted.pop();
			if (cellId) {
				el = document.getElementById(cellId);
				if (el) el.classList.remove('highlight');
				const [_, h, v] = cellId.split('-');
				ship.points.push({ h, v: parseInt(v) });
			}
		}
		dispatch('placeShip', ship);
	};

	export const displayShips = (ships: SeaBattleShip[]) => {
		occupied = [];
		let el, cellId;
		for (const ship of ships) {
			if (ship.gridPoints) {
				for (const point of ship.gridPoints) {
					cellId = `p-${point.Horizontal}-${point.Vertical}`;
					el = document.getElementById(cellId);
					if (el) {
						el.classList.add('occupied');
						occupied.push(cellId);
					}
				}
			}
		}
	};

	onMount(() => {
		reset();
	});
</script>

<div class="placement-grid">
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
				<div id="p-{h}-{v}" />
			{/each}
		</div>
	{/each}
</div>

<div class="controls">
	<div class="selects">
		<div>
			<label for="ship-type">Ship Type</label>
			<select name="ship-type" id="ship-type" bind:value={ship.shipType} on:change={setShipSize}>
				{#each shipsToPlace as s}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="horizontal">Horizontal</label>
			<select
				name="horizontal"
				id="horizontal"
				bind:value={start.horizontal}
				on:change={highLightShip}
			>
				{#each horizontal as h}
					<option value={h}>{h}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="vertical">Vertical</label>
			<select name="vertical" id="vertical" bind:value={start.vertical} on:change={highLightShip}>
				{#each vertical as v}
					<option value={v}>{v}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="direction">Direction</label>
			<select
				name="direction"
				id="direction"
				bind:value={start.direction}
				on:change={highLightShip}
			>
				{#each ShipDirections as d}
					<option value={d}>{d}</option>
				{/each}
			</select>
		</div>
		<div>
			{#if placementErrors.length > 0}
				<ul>
					{#each placementErrors as err}
						<li>{err}</li>
					{/each}
				</ul>
			{:else}
				<button on:click={placeShip}>Place Ship</button>
			{/if}
		</div>
	</div>
</div>

<style>
	div.placement-grid {
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
		@apply h-10 w-10 border border-dotted border-gray-500;
	}
	div.controls {
		@apply mx-2;
	}
	div.selects {
		@apply flex flex-wrap;
	}
	div.selects div {
		@apply mr-4;
	}
	select,
	button {
		@apply border border-black rounded py-1 px-2;
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
	:global(.occupied) {
		@apply bg-gray-400;
	}
</style>
