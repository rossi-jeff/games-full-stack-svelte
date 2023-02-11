<script lang="ts">
	import type { SeaBattle } from '../../../lib/types/sea-battle.type';
	import Eye from '../../Eye.svelte';
	import SeaBattleItem from './SeaBattleItem.svelte';

	export let items: SeaBattle[] = [];
</script>

<div class="sea-battle-items">
	<div class="sea-battle-header">
		<div class="eye">
			<Eye />
		</div>
		<div class="user">User</div>
		<div class="status">Status</div>
		<div class="score">Score</div>
		<div class="axis">Axis</div>
	</div>
	{#each items as item}
		<SeaBattleItem {item} />
	{/each}
</div>

<style>
	div.sea-battle-items {
		@apply mb-4;
	}
	div.sea-battle-header {
		@apply flex flex-wrap justify-between mx-2 font-bold border-b-gray-500 border-dashed border mb-2 bg-gray-300 py-1 px-1;
	}
	div.eye {
		@apply w-8;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.score {
		@apply w-24 text-center;
	}
	div.axis {
		@apply w-24 text-right;
	}
</style>
