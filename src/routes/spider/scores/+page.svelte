<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultLimit, defaultOffset } from '../../../lib/constants';
	import { getPaginatedResults } from '../../../lib/get-paginated-results';
	import type { Spider } from '../../../lib/types/spider.type';
	import Pagination from '../../Pagination.svelte';
	import SpiderItems from './SpiderItems.svelte';

	let Limit = defaultLimit;
	let Offset = defaultOffset;
	const params: { [key: string]: number } = {
		Offset,
		Limit
	};
	const path = '/api/spider';
	type PaginatedSpider =
		| {
				Items: Spider[];
				Count: number;
				Offset: number;
				Limit: number;
		  }
		| undefined;
	let paginated: PaginatedSpider;

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

<h2>Spider Scores</h2>

{#if paginated && paginated.Items}
	<SpiderItems items={paginated.Items} />
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
