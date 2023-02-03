<script lang="ts">
	import type { Word } from '../../lib/types/word.type';

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
</script>

<button on:click={getRandomWord}>Get Word</button>

<div>{JSON.stringify(word)}</div>
