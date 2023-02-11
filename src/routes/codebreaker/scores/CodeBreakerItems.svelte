<script lang="ts">
	import type { CodeBreaker } from '../../../lib/types/code-breaker.type';
	import Eye from '../../Eye.svelte';
	import CodeBreakerItem from './CodeBreakerItem.svelte';

	export let items: CodeBreaker[] = [];
</script>

<div class="code-breaker-items">
	<div class="code-breaker-header">
		<div class="eye">
			<Eye />
		</div>
		<div class="user">User</div>
		<div class="status">Status</div>
		<div class="score">Score</div>
		<div class="colors">Colors</div>
		<div class="columns">Columns</div>
	</div>
	{#each items as item}
		<CodeBreakerItem {item} />
	{/each}
</div>

<style>
	div.code-breaker-items {
		@apply mb-4;
	}
	div.code-breaker-header {
		@apply flex flex-wrap justify-between mx-2 font-bold border-b-gray-500 border-dashed border mb-2 bg-gray-300 py-1 px-1;
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
