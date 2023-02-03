<script lang="ts">
	import type { Word } from '../../lib/types/word.type';
	import HangmanDrawing from './HangmanDrawing.svelte';

	let word: Word = {};
	const Min = 4;
	const Max = 12;

	const getRandomWord = async () => {
		try {
			const result = await fetch('/api/word/random', {
				method: 'POST',
				body: JSON.stringify({ Min, Max })
			});
			console.log(result);
			if (result.ok) {
				word = await result.json();
				console.log(word);
			}
		} catch (error) {
			console.log(error);
		}
	};

	let wrong: string[] = [];

	let drawHangMan = () => {};
</script>

<HangmanDrawing {wrong} bind:drawMan={drawHangMan} />

<button on:click={getRandomWord}>Get Word</button>

<div>{JSON.stringify(word)}</div>
