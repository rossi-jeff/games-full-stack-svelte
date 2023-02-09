<script lang="ts">
	import { onMount } from 'svelte';
	import { baseUrl, defaultLimit, defaultOffset } from '../../../lib/constants';
	import type { GuessWord } from '../../../lib/types/guess-word.type';
	import GuessWordItems from './GuessWordItems.svelte';

	let Limit = defaultLimit;
	let Offset = defaultOffset;
	const params: { [key: string]: number } = {
		Offset,
		Limit
	};

	type PaginatedGuessWords =
		| {
				Items: GuessWord[];
				Count: number;
				Offset: number;
				Limit: number;
		  }
		| undefined;
	let paginated: PaginatedGuessWords;

	const getGuessWords = async () => {
		try {
			let url = new URL('/api/guessword', baseUrl);
			for (const key in params) {
				url.searchParams.append(key, params[key].toString());
			}
			const result = await fetch(url);
			if (result.ok) {
				paginated = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		getGuessWords();
	});
</script>

<h2>Guess Word Scores</h2>

{#if paginated && paginated.Items}
	<GuessWordItems items={paginated.Items} />
{/if}

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
</style>
