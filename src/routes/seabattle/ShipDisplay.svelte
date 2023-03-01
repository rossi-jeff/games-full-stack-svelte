<script lang="ts">
	import type { SeaBattleShip } from '../../lib/types/sea-batte-ship.type';

	export let ship: SeaBattleShip = {};

	const isGridHit = (point: any) => {
		const { Horizontal, Vertical } = point;
		if (!ship.hits) return 'grid';
		const idx = ship.hits.findIndex((h) => h.Horizontal === Horizontal && h.Vertical === Vertical);
		if (idx != -1) return 'Hit';
		return 'grid';
	};
</script>

<div class="ship">
	<div class="ship-icon">
		{#if ship && ship.gridPoints}
			{#each ship.gridPoints as point}
				<div class={isGridHit(point)}>
					<span />
				</div>
			{/each}
		{/if}
	</div>
	<div class="ship-type">{ship.Type}</div>
</div>

<style>
	div.ship {
		@apply py-2 px-2 text-center mr-2 mb-2 border border-black rounded bg-white;
	}
	div.ship-icon {
		@apply flex justify-center;
	}
	div.ship-icon div {
		@apply h-10 w-10 bg-gray-500 text-center pb-1 pt-1;
	}
	:global(div.Hit span) {
		@apply w-7 h-7 rounded-full bg-red-400 inline-block;
	}
	div.ship-type {
		@apply text-center font-bold text-sm;
	}
</style>
