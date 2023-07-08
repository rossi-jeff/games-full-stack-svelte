<script lang="ts">
	import { defaultLimit, defaultOffset } from '$lib/constants';
	import { getPaginatedResults } from '$lib/get-paginated-results';
	import type { PokerSquare } from '$lib/types/poker-square.type';
	import { onMount } from 'svelte';
	import Pagination from '../../Pagination.svelte';

	let Limit = defaultLimit;
	let Offset = defaultOffset;
	const params: { [key: string]: number } = {
		Offset,
		Limit
	};
	const path = '/api/poker_square';
	type PaginatedPokerSquare =
		| {
				Items: PokerSquare[];
				Count: number;
				Offset: number;
				Limit: number;
		  }
		| undefined;
	let paginated: PaginatedPokerSquare;

	const changePage = async (event: any) => {
		const { current, limit } = event.detail;
		params.Offset = (current - 1) * limit;
		params.Limit = limit;
		paginated = await getPaginatedResults(path, params);
		initPagination();
	};

	let initPagination = () => {};

	onMount(async () => {
		paginated = await getPaginatedResults(path, params);
	});
</script>

<svelte:head>
	<title>Poker Squares Scores</title>
</svelte:head>

<h2>Poker Squares Scores</h2>

{#if paginated && paginated.Items}
	<div>{JSON.stringify(paginated.Items)}</div>
{/if}

{#if paginated}
	<Pagination
		count={paginated.Count}
		limit={paginated.Limit}
		offset={paginated.Offset}
		bind:init={initPagination}
		on:changePage={changePage}
	/>
{/if}

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
</style>
