<script lang="ts">
	import { onMount } from 'svelte';
	import { baseUrl, defaultLimit, defaultOffset } from '../../../lib/constants';
	import type { CodeBreaker } from '../../../lib/types/code-breaker.type';
	import CodeBreakerItems from './CodeBreakerItems.svelte';

	let Limit = defaultLimit;
	let Offset = defaultOffset;
	const params: { [key: string]: number } = {
		Offset,
		Limit
	};

	type PaginatedCodeBreakers =
		| {
				Items: CodeBreaker[];
				Count: number;
				Offset: number;
				Limit: number;
		  }
		| undefined;
	let paginated: PaginatedCodeBreakers;

	const getCodeBreakers = async () => {
		try {
			let url = new URL('/api/codebreaker', baseUrl);
			for (const key in params) {
				url.searchParams.append(key, params[key].toString());
			}
			const result = await fetch(url);
			if (result.ok) {
				paginated = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		getCodeBreakers();
	});
</script>

<h2>Code Breaker Scores</h2>

{#if paginated && paginated.Items}
	<CodeBreakerItems items={paginated.Items} />
{/if}

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
</style>
