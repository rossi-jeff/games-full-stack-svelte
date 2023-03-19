<script lang="ts">
	import type { CodeBreaker } from '../../../../lib/types/code-breaker.type';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import CodeBreakerGuessList from '../../CodeBreakerGuessList.svelte';
	import CodeBreaketSolution from '../../CodeBreaketSolution.svelte';
	import ChevronLeft from '../../../ChevronLeft.svelte';
	import { railsRoot } from '../../../../lib/constants';

	let game: CodeBreaker = {};
	let id = $page.params.id;

	const getCodeBreaker = async () => {
		try {
			const result = await fetch(`${railsRoot}/api/code_breaker/${id}`);
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		getCodeBreaker();
	});
</script>

<svelte:head>
	<title>Code Breaker Score</title>
</svelte:head>

<div class="back-link">
	<a href="/codebreaker/scores">
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

	<div class="colors">
		<strong>Colors</strong>
		{game.Colors}
	</div>

	<div class="columns">
		<strong>Columns</strong>
		{game.Columns}
	</div>
</div>

{#if game && game.guesses && game.guesses.length > 0}
	<h2>Guesses</h2>
	<CodeBreakerGuessList guesses={game.guesses} />
{/if}

{#if game && game.codes}
	<CodeBreaketSolution codes={game.codes} />
{/if}

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.back-link a {
		@apply flex mb-2 h-8 font-bold;
	}
	div.back-link a span {
		@apply mt-1;
	}
</style>
