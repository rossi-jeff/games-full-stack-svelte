<script lang="ts">
	import type { TenGrand } from '../../../lib/types/ten-grand.type';
	import Eye from '../../Eye.svelte';

	export let item: TenGrand = {};
</script>

<div class="ten-grand-item">
	<div class="eye">
		<a href="/tengrand/scores/{item.Id}">
			<Eye />
		</a>
	</div>
	<div class="user">{item.user ? item.user.UserName : 'Anonymous'}</div>
	<div class="status">{item.Status}</div>
	<div class="score">{item.Score}</div>
</div>

<style>
	div.ten-grand-item {
		@apply flex flex-wrap justify-between mx-2 border-b-gray-400 border-dashed border mb-2 px-1;
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
