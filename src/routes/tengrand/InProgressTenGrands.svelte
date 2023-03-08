<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TenGrand } from '../../lib/types/ten-grand.type';

	export let inProgress: TenGrand[] = [];

	const dispatch = createEventDispatcher();

	const continueGame = (id: number | undefined) => {
		dispatch('continueGame', { id });
	};
</script>

<div class="in-progress-ten-grands">
	<h2>In Progress Games</h2>
	<div class="ten-grands-list">
		<div class="ten-grand-header">
			<div class="button" />
			<div class="score">Score</div>
			<div class="date">Date</div>
		</div>
		{#each inProgress as ten_grand}
			<div class="ten-grand">
				<div class="button">
					{#if ten_grand.id}
						<button on:click={() => continueGame(ten_grand.id)}> Continue </button>
					{/if}
				</div>
				<div class="score">{ten_grand.Score}</div>
				<div class="date">
					{#if ten_grand.created_at}
						{ten_grand.created_at.toString().split('T')[0]}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	div.in-progress-ten-grands {
		@apply mt-4;
	}
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.ten-grands-list {
		@apply bg-white p-2 rounded mx-2;
	}
	div.ten-grand-header {
		@apply flex flex-wrap justify-between  bg-blue-300 font-bold px-1;
	}
	div.ten-grand {
		@apply flex flex-wrap mx-2 justify-between border border-dashed border-b-gray-400;
	}
	div.button {
		@apply w-20;
	}
	div.score {
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
