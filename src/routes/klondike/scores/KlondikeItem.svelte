<script lang="ts">
	import { displayElapsed } from '../../../lib/display-elapsed';
	import type { Klondike } from '../../../lib/types/klondike.type';

	export let item: Klondike = {};
</script>

<div class="klondike-item">
	<div class="user">{item.user ? item.user.UserName : 'Anonymous'}</div>
	<div class="status">{item.Status}</div>
	<div class="elapsed">
		{#if item.Elapsed != undefined}
			{displayElapsed(item.Elapsed)}
		{/if}
	</div>
	<div class="moves">{item.Moves}</div>
</div>

<style>
	div.klondike-item {
		@apply flex flex-wrap justify-between mx-2 border-b-gray-400 border-dashed border mb-2 px-1;
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
