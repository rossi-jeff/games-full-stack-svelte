<script lang="ts">
	import type { Yacht } from '../../../lib/types/yacht.type';
	import Eye from '../../Eye.svelte';

	export let item: Yacht = {};
</script>

<div class="yacht-item">
	<div class="eye">
		<a href="/yacht/scores/{item.Id}">
			<Eye />
		</a>
	</div>
	<div class="user">{item.user ? item.user.UserName : 'Anonymous'}</div>
	<div class="score">{item.Total}</div>
</div>

<style>
	div.yacht-item {
		@apply flex flex-wrap justify-between mx-2 border-b-gray-400 border-dashed border mb-2 px-1;
	}
	div.eye {
		@apply w-8;
	}
</style>
