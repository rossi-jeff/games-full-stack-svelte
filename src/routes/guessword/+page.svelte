<script lang="ts">
	import type { Word } from '$lib/types/word.type';

	let word: Word = {};
	let Length: number = 5;

	const getRandomWord = async () => {
		try {
			const result = await fetch('/api/word/random', {
				method: 'POST',
				body: JSON.stringify({ Length })
			});
			console.log(result)
			if (result.ok) {
				word = await result.json();
				console.log(word)
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<button on:click={getRandomWord}>Get Word</button>

<div>{JSON.stringify(word)}</div>
