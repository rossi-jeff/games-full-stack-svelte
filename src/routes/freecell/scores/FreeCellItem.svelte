<script lang="ts">
	import { displayElapsed } from '../../../lib/display-elapsed';
	import type { Freecell } from '../../../lib/types/free-cell.type';

	export let item: Freecell = {};
</script>

<div class="free-cell-item">
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
	div.free-cell-item {
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
