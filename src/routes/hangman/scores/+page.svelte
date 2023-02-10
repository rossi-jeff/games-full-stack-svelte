<script lang="ts">
	import { onMount } from 'svelte';
	import { baseUrl, defaultLimit, defaultOffset } from '../../../lib/constants';
	import type { HangMan } from '../../../lib/types/hang-man-type';
	import HangManItems from './HangManItems.svelte';

	let Limit = defaultLimit;
	let Offset = defaultOffset;
	const params: { [key: string]: number } = {
		Offset,
		Limit
	};

	type PaginatedHangMen =
		| {
				Items: HangMan[];
				Count: number;
				Offset: number;
				Limit: number;
		  }
		| undefined;
	let paginated: PaginatedHangMen;

	const getHangMen = async () => {
		try {
			let url = new URL('/api/hangman', baseUrl);
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
		getHangMen();
	});
</script>

<h2>Hang Man Scores</h2>

{#if paginated && paginated.Items}
	<HangManItems items={paginated.Items} />
{/if}

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
</style>
