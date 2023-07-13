<script lang="ts">
	import { displayElapsed } from '../../../lib/display-elapsed';
	import type { Spider } from '../../../lib/types/spider.type';

	export let item: Spider = {};
</script>

<div class="spider-item">
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
	div.spider-item {
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
