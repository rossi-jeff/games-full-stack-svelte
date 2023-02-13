<script lang="ts">
	import type { HangMan } from '../../../lib/types/hang-man-type';
	import Eye from '../../Eye.svelte';
	import HangManItem from './HangManItem.svelte';

	export let items: HangMan[] = [];
</script>

<div class="hang-man-items">
	<div class="hang-man-header">
		<div class="eye">
			<Eye />
		</div>
		<div class="user">User</div>
		<div class="status">Status</div>
		<div class="score">Score</div>
		<div class="correct">Correct</div>
		<div class="wrong">Wrong</div>
		<div class="word">Word</div>
	</div>
	{#each items as item}
		<HangManItem {item} />
	{/each}
</div>

<style>
	div.hang-man-items {
		@apply mb-4;
	}
	div.hang-man-header {
		@apply flex flex-wrap justify-between mx-2 font-bold border-b-gray-500 border-dashed border mb-2 bg-gray-300 py-1 px-1;
	}
	div.eye {
		@apply w-8;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.score,
	div.correct,
	div.wrong {
		@apply w-20 text-center;
	}
	div.word {
		@apply w-24 text-right;
	}
</style>
