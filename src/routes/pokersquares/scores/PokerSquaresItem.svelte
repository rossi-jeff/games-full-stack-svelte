<script lang="ts">
	import type { PokerSquare } from '$lib/types/poker-square.type';

	export let item: PokerSquare;
</script>

<div class="poker-squares-item">
	<div class="user">{item.user ? item.user.UserName : 'Anonymous'}</div>
	<div class="status">{item.Status || 'N/A'}</div>
	<div class="score">{item.Score}</div>
</div>

<style>
	div.poker-squares-item {
		@apply flex flex-wrap justify-between mx-2 border-b-gray-400 border-dashed border mb-2 px-1;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.score {
		@apply w-24;
	}
	div.score {
		@apply text-right;
	}
</style>
