<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultLimit, defaultOffset } from '../../../lib/constants';
	import { getPaginatedResults } from '../../../lib/get-paginated-results';
	import type { HangMan } from '../../../lib/types/hang-man-type';
	import Pagination from '../../Pagination.svelte';
	import HangManItems from './HangManItems.svelte';

	let Limit = defaultLimit;
	let Offset = defaultOffset;
	const params: { [key: string]: number } = {
		Offset,
		Limit
	};
	const path = '/api/hang_man';

	type PaginatedHangMen =
		| {
				Items: HangMan[];
				Count: number;
				Offset: number;
				Limit: number;
		  }
		| undefined;
	let paginated: PaginatedHangMen;

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
		initPagination();
	});
</script>

<svelte:head>
	<title>Hang Man Scores</title>
</svelte:head>

<h2>Hang Man Scores</h2>

{#if paginated && paginated.Items}
	<HangManItems items={paginated.Items} />
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
