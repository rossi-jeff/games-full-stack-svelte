<script lang="ts">
	import type { CodeBreakerGuess } from '../../lib/types/code-breaker-guess.type';

	export let guesses: CodeBreakerGuess[] = [];
</script>

<div class="code-breaker-guesses">
	{#each guesses as guess}
		<div class="code-breaker-guess">
			<div class="colors">
				{#if guess.colors}
					{#each guess.colors as color}
						<div class={color.Color} />
					{/each}
				{/if}
			</div>
			<div class="keys">
				{#if guess.keys}
					{#each guess.keys as key}
						<div class={key.Key} />
					{/each}
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	div.code-breaker-guess-list {
		@apply mb-4 mx-2;
	}
	div.code-breaker-guess {
		@apply flex flex-wrap border border-b-gray-500 border-dashed py-1;
	}
	div.colors {
		@apply flex flex-wrap mr-8;
	}
	div.colors div {
		@apply h-8 w-8 rounded-full border mr-4;
	}
	div.keys {
		@apply flex flex-wrap;
	}
	div.keys div {
		@apply h-4 w-4 rounded-full border mr-2;
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
