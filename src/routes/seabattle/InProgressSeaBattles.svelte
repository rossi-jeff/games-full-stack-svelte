<script lang="ts">
	import type { SeaBattle } from '$lib/types/sea-battle.type';
	import { createEventDispatcher } from 'svelte';

	export let inProgress: SeaBattle[] = [];

	const dispatch = createEventDispatcher();

	const continueGame = (id: number | undefined) => {
		dispatch('continueGame', { id });
	};
</script>

<div class="in-progess-sea-battles">
	<h2>In Progress Games</h2>
	<div class="sea-battles-list">
		<div class="sea-battle-header">
			<div class="button" />
			<div class="axis">Axis</div>
			<div class="ships">Ships</div>
			<div class="date">Date</div>
		</div>
		{#each inProgress as sea_battle}
			<div class="sea-battle">
				<div class="button">
					{#if sea_battle.id}
						<button on:click={() => continueGame(sea_battle.id)}> Continue </button>
					{/if}
				</div>
				<div class="axis">{sea_battle.Axis}</div>
				<div class="ships">{sea_battle.ships ? Math.round(sea_battle.ships.length / 2) : 0}</div>
				<div class="date">
					{#if sea_battle.created_at}
						{sea_battle.created_at.toString().split('T')[0]}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	div.in-progess-sea-battles {
		@apply mt-4;
	}
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.sea-battles-list {
		@apply bg-white p-2 rounded mx-2;
	}
	div.sea-battle-header {
		@apply flex flex-wrap justify-between  bg-blue-300 font-bold px-1;
	}
	div.sea-battle {
		@apply flex flex-wrap mx-2 justify-between border border-dashed border-b-gray-400;
	}
	div.button {
		@apply w-20;
	}
	div.axis,
	div.ships {
		@apply w-12 text-center;
	}
	div.date {
		@apply w-32 text-right;
	}
	button {
		@apply border border-black rounded px-1 py-0 my-1 bg-white;
	}
	button:hover {
		@apply bg-blue-400;
	}
</style>
