<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CodeBreaker } from '../../lib/types/code-breaker.type';

	const dispatch = createEventDispatcher();

	const continueGame = (id: number | undefined) => {
		dispatch('continueGame', { id })
	}

	export let inProgress: CodeBreaker[] = []
</script>

<div class="in-progress-code-breakers">
	<h2>In Progress Games</h2>
	<div class="code-breakers-list">
		<div class="code-breaker-header">
			<div class="button"></div>
			<div class="columns">Columns</div>
			<div class="colors">Colors</div>
			<div class="score">Score</div>
			<div class="date">Date</div>
		</div>
		{#each inProgress as code_breaker}
			<div class="code-breaker">
				<div class="button">
					{#if code_breaker.id}
					<button on:click={() => continueGame(code_breaker.id)}>
						Continue
					</button>
					{/if}
				</div>
				<div class="columns">{code_breaker.Columns}</div>
				<div class="colors">{code_breaker.Colors}</div>
				<div class="score">{code_breaker.Score}</div>
				<div class="date">
					{#if code_breaker.created_at}
						{code_breaker.created_at.toString().split('T')[0]}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	div.in-progress-code-breakers {
		@apply mt-4;
	}
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.code-breakers-list {
		@apply bg-white p-2 rounded mx-2;
	}
	div.code-breaker, div.code-breaker-header {
		@apply flex flex-wrap mx-2 justify-between;
	}
	div.code-breaker-header {
		@apply bg-blue-300 font-bold px-1;
	}
	div.code-breaker {
		@apply border border-dashed border-b-gray-400;
	}
	div.button {
		@apply w-20;
	}
	div.columns, div.colors, div.score {
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