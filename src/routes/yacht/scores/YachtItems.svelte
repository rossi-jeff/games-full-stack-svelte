<script lang="ts">
	import type { Yacht } from '../../../lib/types/yacht.type';
	import YachtItem from './YachtItem.svelte';

	export let items: Yacht[] = [];
</script>

<div class="yacht-items">
	<div class="yacht-header">
		<div class="user">User</div>
		<div class="score">Score</div>
	</div>
	{#each items as item}
		<YachtItem {item} />
	{/each}
</div>

<style>
	div.yacht-items {
		@apply mb-4;
	}
	div.yacht-header {
		@apply flex flex-wrap justify-between mx-2 font-bold border-b-gray-500 border-dashed border mb-2 bg-gray-300 py-1 px-1;
	}
</style>
