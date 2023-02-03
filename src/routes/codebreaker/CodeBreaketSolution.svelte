<script lang="ts">
	import type { CodeBreakerCode } from '$lib/types/code-breaker-code.type';

	export let codes: CodeBreakerCode[] = [];
</script>

<div class="solution-container">
	<h2>Solution</h2>
	<div class="solution">
		{#if codes.length}
			{#each codes as code}
				<div class={code.Color} />
			{/each}
		{/if}
	</div>
</div>

<style>
	div.solution-container {
		@apply p-2 mb-4;
	}
	h2 {
		@apply font-bold text-lg mb-4;
	}
	div.solution {
		@apply flex flex-wrap;
	}
	div.solution div {
		@apply h-8 w-8 rounded-full border mr-4 py-1;
	}
	.Black {
		@apply bg-black border-black text-white;
	}
	.Blue {
		@apply bg-blue-700 border-blue-900 text-white;
	}
	.Brown {
		@apply bg-amber-800 border-amber-900 text-white;
	}
	.Green {
		@apply bg-green-500 border-green-900;
	}
	.Orange {
		@apply bg-orange-400 border-orange-900;
	}
	.Purple {
		@apply bg-purple-600 border-purple-900;
	}
	.Red {
		@apply bg-red-600 border-red-900;
	}
	.White {
		@apply bg-white border-black;
	}
	.Yellow {
		@apply bg-yellow-300 border-yellow-900;
	}
</style>
