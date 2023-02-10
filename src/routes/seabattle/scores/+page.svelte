<script lang="ts">
	import { onMount } from 'svelte';
	import { baseUrl, defaultLimit, defaultOffset } from '../../../lib/constants';
	import type { SeaBattle } from '../../../lib/types/sea-battle.type';
	import SeaBattleItems from './SeaBattleItems.svelte';

	let Limit = defaultLimit;
	let Offset = defaultOffset;
	const params: { [key: string]: number } = {
		Offset,
		Limit
	};

	type PaginatedSeabattles =
		| {
				Items: SeaBattle[];
				Count: number;
				Offset: number;
				Limit: number;
		  }
		| undefined;
	let paginated: PaginatedSeabattles;

	const getSeaBattles = async () => {
		try {
			let url = new URL('/api/seabattle', baseUrl);
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
		getSeaBattles();
	});
</script>

<h2>Sea Battle Scores</h2>

{#if paginated && paginated.Items}
	<SeaBattleItems items={paginated.Items} />
{/if}

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
</style>
