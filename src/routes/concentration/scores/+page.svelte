<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultLimit, defaultOffset } from '../../../lib/constants';
	import { getPaginatedResults } from '../../../lib/get-paginated-results';
	import type { Concentration } from '../../../lib/types/concentration.type';
	import Pagination from '../../Pagination.svelte';
	import ConcentrationItems from './ConcentrationItems.svelte';

	let Limit = defaultLimit;
	let Offset = defaultOffset;
	const params: { [key: string]: number } = {
		Offset,
		Limit
	};
	const path = '/api/concentration';
	type PaginatedConcentration =
		| {
				Items: Concentration[];
				Count: number;
				Offset: number;
				Limit: number;
		  }
		| undefined;
	let paginated: PaginatedConcentration;

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
	<title>Concentration Scores</title>
</svelte:head>

<h2>Concentration Scores</h2>

{#if paginated && paginated.Items}
	<ConcentrationItems items={paginated.Items} />
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
