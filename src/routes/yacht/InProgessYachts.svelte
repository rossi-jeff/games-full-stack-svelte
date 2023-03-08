<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Yacht } from '../../lib/types/yacht.type';

	export let inProgress: Yacht[] = [];

	const dispatch = createEventDispatcher();

	const continueGame = (id: number | undefined) => {
		dispatch('continueGame', { id });
	};
</script>

<div class="in-progress-yachts">
	<h2>In Progress Games</h2>
	<div class="yachts-list">
		<div class="yacht-header">
			<div class="button" />
			<div class="score">Score</div>
			<div class="turns">Turns</div>
			<div class="date">Date</div>
		</div>
		{#each inProgress as yacht}
			<div class="yacht">
				<div class="button">
					{#if yacht.id}
						<button on:click={() => continueGame(yacht.id)}> Continue </button>
					{/if}
				</div>
				<div class="score">{yacht.Total}</div>
				<div class="turns">{yacht.NumTurns}</div>
				<div class="date">
					{#if yacht.created_at}
						{yacht.created_at.toString().split('T')[0]}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	div.in-progress-yachts {
		@apply mt-4;
	}
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.yachts-list {
		@apply bg-white p-2 rounded mx-2;
	}
	div.yacht-header {
		@apply flex flex-wrap justify-between  bg-blue-300 font-bold px-1;
	}
	div.yacht {
		@apply flex flex-wrap mx-2 justify-between border border-dashed border-b-gray-400;
	}
	div.button {
		@apply w-20;
	}
	div.score, div.turns {
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
