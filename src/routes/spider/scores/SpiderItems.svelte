<script lang="ts">
	import type { Spider } from '../../../lib/types/spider.type';
	import SpiderItem from './SpiderItem.svelte';

	export let items: Spider[] = [];
</script>

<div class="spider-items">
	<div class="spider-header">
		<div class="user">User</div>
		<div class="status">Status</div>
		<div class="elapsed">Time</div>
		<div class="moves">Moves</div>
	</div>
	{#each items as item}
		<SpiderItem {item} />
	{/each}
</div>

<style>
	div.spider-items {
		@apply mb-2 bg-white rounded mx-2 p-2;
	}
	div.spider-header {
		@apply flex flex-wrap justify-between mx-2 font-bold border-b-gray-500 border-dashed border mb-2 bg-gray-300 py-1 px-1;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.elapsed {
		@apply w-20 text-center;
	}
	div.moves {
		@apply w-20 text-right;
	}
</style>
