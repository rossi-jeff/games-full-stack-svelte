<script lang="ts">
	import type { CodeBreaker } from '../../../lib/types/code-breaker.type';
	import Eye from '../../Eye.svelte';

	export let item: CodeBreaker = {};
</script>

<div class="code-breaker-item">
	<div class="eye">
		<a href="/codebreaker/scores/{item.id}">
			<Eye />
		</a>
	</div>
	<div class="user">{item.user ? item.user.UserName : 'Anonymous'}</div>
	<div class="status">{item.Status}</div>
	<div class="score">{item.Score}</div>
	<div class="colors">{item.Colors}</div>
	<div class="columns">{item.Columns}</div>
</div>

<style>
	div.code-breaker-item {
		@apply flex flex-wrap justify-between mx-2 border-b-gray-400 border-dashed border mb-2 px-1;
	}
	div.eye {
		@apply w-8;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.score,
	div.colors {
		@apply w-24 text-center;
	}
	div.columns {
		@apply w-24 text-right;
	}
</style>
