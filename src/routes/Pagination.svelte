<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let offset: number = 0;
	export let limit: number = 10;
	export let count: number = 0;

	const local: { [key: string]: number } = {
		current: 1,
		offset,
		limit,
		count
	};
	let draw: boolean = false;
	const limits: number[] = [5, 10, 25, 50];
	let pages: number[] = [];

	const dispatch = createEventDispatcher();

	const buildPages = () => {
		pages = [];
		let page = 1;
		let counter = 0;
		while (counter < local.count) {
			pages.push(page);
			page++;
			counter += local.limit;
		}
	};

	export const init = () => {
		draw = false;
		local.offset = offset;
		local.limit = limit;
		local.count = count;
		buildPages();
		draw = true;
	};

	const limitChanged = () => {
		changePage(1);
	};

	const changePage = (page: number) => {
		draw = false;
		local.current = page;
		draw = true;
		dispatch('changePage', local);
	};

	onMount(() => {
		init();
	});
</script>

<div class="pagination-container">
	<div class="limit-container">
		<label for="limit">Limit</label>
		<select name="limit" id="limit" bind:value={local.limit} on:change={limitChanged}>
			{#each limits as l}
				<option value={l} selected={l === local.limit}>{l}</option>
			{/each}
		</select>
	</div>
	<div class="pages-container">
		{#if draw}
			{#each pages as page}
				{#if page === local.current}
					<button class="current" disabled>{page}</button>
				{:else}
					<button on:click={() => changePage(page)}>{page}</button>
				{/if}
			{/each}
		{/if}
	</div>
</div>

<style>
	div.pagination-container {
		@apply flex flex-wrap justify-between mx-2 rounded bg-white px-2 pt-2;
	}
	div.pages-container {
		@apply flex flex-wrap;
	}
	div.pages-container button {
		@apply px-1 py-1 mr-2 mb-2;
	}
	button.current {
		@apply border-blue-900 border rounded-full bg-blue-300;
	}
</style>
