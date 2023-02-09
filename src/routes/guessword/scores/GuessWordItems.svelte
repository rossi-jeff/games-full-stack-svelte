<script lang="ts">
	import type { GuessWord } from '../../../lib/types/guess-word.type';
	import GuessWordItem from './GuessWordItem.svelte';

	export let items: GuessWord[] = [];
</script>

<div class="guess-word-items">
	<div class="guess-word-header">
		<div class="user">User</div>
		<div class="status">Status</div>
		<div class="score">Score</div>
		<div class="word">Word</div>
		<div class="length">Length</div>
	</div>
	{#each items as item}
		<GuessWordItem {item} />
	{/each}
</div>

<style>
	div.guess-word-items {
		@apply mb-4;
	}
	div.guess-word-header {
		@apply flex flex-wrap justify-between mx-2 font-bold border-b-gray-500 border-dashed border mb-2 bg-gray-300 py-1 px-1;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.score,
	div.word {
		@apply w-24 text-center;
	}
	div.length {
		@apply w-24 text-right;
	}
</style>
