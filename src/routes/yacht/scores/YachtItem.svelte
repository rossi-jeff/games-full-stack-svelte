<script lang="ts">
	import type { Yacht } from '../../../lib/types/yacht.type';

	export let item: Yacht = {};
</script>

<div class="yacht-item">
	<div class="user">{item.UserId ? item.UserId : 'Anonymous'}</div>
	<div class="score">{item.Total}</div>
</div>

<style>
	div.yacht-item {
		@apply flex flex-wrap justify-between mx-2 border-b-gray-400 border-dashed border mb-2 px-1;
	}
</style>
