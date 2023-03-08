<script lang="ts">
	import type { HangMan } from '$lib/types/hang-man-type';
	import { createEventDispatcher } from 'svelte';

	export let inProgress: HangMan[] = [];

	const dispatch = createEventDispatcher();

	const continueGame = (id: number | undefined) => {
		dispatch('continueGame', { id });
	};
</script>

<div class="in-progress-hang-men">
	<h2>In Progress Games</h2>
	<div class="hang-men-list">
		<div class="hang-man-header">
			<div class="button" />
			<div class="length">Length</div>
			<div class="correct">Correct</div>
			<div class="wrong">Wrong</div>
			<div class="date">Date</div>
		</div>
		{#each inProgress as hang_man}
			<div class="hang-man">
				<div class="button">
					{#if hang_man.id}
						<button on:click={() => continueGame(hang_man.id)}> Continue </button>
					{/if}
				</div>
				<div class="length">
					{hang_man.word ? hang_man.word.Length : 0}
				</div>
				<div class="correct">{hang_man.Correct}</div>
				<div class="wrong">{hang_man.Wrong}</div>
				<div class="date">
					{#if hang_man.created_at}
						{hang_man.created_at.toString().split('T')[0]}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	div.in-progress-hang-men {
		@apply mt-4;
	}
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.hang-men-list {
		@apply bg-white p-2 rounded mx-2;
	}
	div.hang-man-header {
		@apply flex flex-wrap justify-between  bg-blue-300 font-bold px-1;
	}
	div.hang-man {
		@apply flex flex-wrap mx-2 justify-between border border-dashed border-b-gray-400;
	}
	div.button {
		@apply w-20;
	}
	div.length,
	div.correct,
	div.wrong {
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
