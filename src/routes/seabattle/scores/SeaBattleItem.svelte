<script lang="ts">
	import type { SeaBattle } from '../../../lib/types/sea-battle.type';

	export let item: SeaBattle = {};
</script>

<div class="sea-battle-item">
	<div class="user">{item.user ? item.user.UserName : 'Anonymous'}</div>
	<div class="status">{item.Status}</div>
	<div class="score">{item.Score}</div>
	<div class="axis">{item.Axis}</div>
</div>

<style>
	div.sea-battle-item {
		@apply flex flex-wrap justify-between mx-2 border-b-gray-400 border-dashed border mb-2 px-1;
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
