<script lang="ts">
	import type { TenGrand } from '../../../lib/types/ten-grand.type';
	import Eye from '../../Eye.svelte';
	import TenGrandItem from './TenGrandItem.svelte';

	export let items: TenGrand[] = [];
</script>

<div class="ten-grand-items">
	<div class="ten-grand-header">
		<div class="eye">
			<Eye />
		</div>
		<div class="user">User</div>
		<div class="status">Status</div>
		<div class="score">Score</div>
	</div>
	{#each items as item}
		<TenGrandItem {item} />
	{/each}
</div>

<style>
	div.ten-grand-items {
		@apply mb-4;
	}
	div.ten-grand-header {
		@apply flex flex-wrap justify-between mx-2 font-bold border-b-gray-500 border-dashed border mb-2 bg-gray-300 py-1 px-1;
	}
	div.eye {
		@apply w-8;
	}
	div.user {
		@apply w-36;
	}
	div.status {
		@apply w-20 text-center;
	}
	div.score {
		@apply w-20 text-right;
	}
</style>
