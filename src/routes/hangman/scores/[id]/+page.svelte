<script lang="ts">
	import type { HangMan } from '../../../../lib/types/hang-man-type';
	import { page } from '$app/stores';
	import { alphabet } from '../../../../lib/alphabet';
	import { onMount } from 'svelte';
	import ChevronLeft from '../../../ChevronLeft.svelte';
	import HangmanDrawing from '../../HangmanDrawing.svelte';

	let game: HangMan = {};
	let id = $page.params.id;
	let wrong: string[] = [];
	let correct: string[] = [];
	let display: string[] = alphabet.toUpperCase().split('');

	const getClass = (letter: string) => {
		if (correct.includes(letter)) return 'correct';
		if (wrong.includes(letter)) return 'wrong';
		return 'unused';
	};

	let drawHangMan = () => {};

	const getHangMan = async () => {
		try {
			const result = await fetch(`/api/hangman/${id}`);
			if (result.ok) {
				game = await result.json();
				if (game.Wrong) wrong = game.Wrong.toUpperCase().split(',');
				if (game.Correct) correct = game.Correct.toUpperCase().split(',');
				setTimeout(() => drawHangMan(), 0);
			}
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		getHangMan();
	});
</script>

<div class="back-link">
	<a href="/hangman/scores">
		<ChevronLeft />
		<span>Back</span>
	</a>
</div>

<HangmanDrawing {wrong} bind:drawMan={drawHangMan} />

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

<div class="letter-display">
	{#if wrong.length || correct.length}
		{#each display as letter}
			<div class={getClass(letter)}>{letter}</div>
		{/each}
	{/if}
</div>

<style>
	div.back-link a {
		@apply flex mb-2 h-8 font-bold;
	}
	div.back-link a span {
		@apply mt-1;
	}
	div.letter-display {
		@apply flex flex-wrap justify-between mx-2 bg-white rounded p-2;
	}
	div.correct {
		@apply border border-green-800 rounded-full px-1 bg-green-200 font-bold;
	}
	div.wrong {
		@apply border border-red-800 rounded-full line-through px-1 bg-red-200 font-bold;
	}
</style>
