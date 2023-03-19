<script lang="ts">
	import type { GuessWord } from '../../../../lib/types/guess-word.type';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import GuessWordGuessList from '../../GuessWordGuessList.svelte';
	import ChevronLeft from '../../../ChevronLeft.svelte';
	import { railsRoot } from '../../../../lib/constants';

	let game: GuessWord = {};
	let id = $page.params.id;

	const getGuessWord = async () => {
		try {
			const result = await fetch(`${railsRoot}/api/guess_word/${id}`);
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		getGuessWord();
	});
</script>

<svelte:head>
	<title>Guess Word Score</title>
</svelte:head>

<div class="back-link">
	<a href="/guessword/scores">
		<ChevronLeft />
		<span>Back</span>
	</a>
</div>

<div class="mx-2 mb-2 bg-white rounded p-2">
	<div class="user">
		<strong>User</strong>
		{game.user ? game.user.UserName : 'Anonymous'}
	</div>
	<div class="status">
		<strong>Status</strong>
		{game.Status}
	</div>
	<div class="score">
		<strong>Score</strong>
		{game.Score}
	</div>
	<div class="word">
		<strong>Word</strong>
		{game.word ? game.word.Word : ''}
	</div>
</div>

{#if game && game.guesses && game.guesses.length}
	<GuessWordGuessList guesses={game.guesses} />
{/if}

<style>
	div.back-link a {
		@apply flex mb-2 h-8 font-bold;
	}
	div.back-link a span {
		@apply mt-1;
	}
</style>
