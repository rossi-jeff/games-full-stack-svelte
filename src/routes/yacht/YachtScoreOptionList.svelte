<script lang="ts">
	import type { YachtScoreOption } from '$lib/types/yacht-score-option.type';
	import { createEventDispatcher } from 'svelte';

	export let options: YachtScoreOption[] = [];
	export let flag: boolean = false;
	let selected = 0;

	const dispatch = createEventDispatcher();

	const scoreTurn = () => {
		const { Category } = options[selected];
		dispatch('score', { Category });
	};
</script>

<div class="yacht-score-options">
	{#each options as option, index}
		<div class="yacht-score-option">
			<div class="radio">
				<input
					type="radio"
					name="option-{index}"
					id="option-{index}"
					value={index}
					bind:group={selected}
				/>
			</div>
			<div class="category">{option.Category}</div>
			<div class="score">{option.Score}</div>
		</div>
	{/each}
	<div class="py-2">
		<button on:click={scoreTurn} disabled={flag}>Score Turn</button>
	</div>
</div>

<style>
	div.yacht-score-options {
		@apply border border-black rounded p-2 mb-2;
	}
	div.yacht-score-option {
		@apply flex flex-wrap py-1 border border-dashed border-b-gray-500;
	}
	div.category {
		@apply grow ml-2;
	}
	button {
		@apply border border-black rounded py-1 px-2 mr-2 mb-2;
	}
	button:hover {
		@apply bg-blue-400;
	}
</style>
