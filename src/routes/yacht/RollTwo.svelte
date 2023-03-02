<script lang="ts">
	import type { YachtTurn } from '$lib/types/yacht-turn.type';
	import { createEventDispatcher } from 'svelte';
	import FiveDice from './FiveDice.svelte';

	export let turn: YachtTurn = {};
	export let flag: boolean = false;
	const Dice: number[] = turn.RollTwo ? turn.RollTwo.split(',').map((d) => parseInt(d)) : [];
	let Keep: number[] = [];

	const dispatch = createEventDispatcher();

	const keepChanged = (event: any) => {
		Keep = event.detail.Keep;
	};

	const thirdRoll = () => {
		dispatch('roll', { Keep });
	};
</script>

<div class="roll-two">
	<h2>Roll Two</h2>
	<FiveDice {Dice} {flag} on:keepChanged={keepChanged} />
	{#if !flag}
		<div>
			<button on:click={thirdRoll}>Third Roll</button>
		</div>
	{/if}
</div>

<style>
	button {
		@apply border border-black rounded py-1 px-2 mr-2 mb-2 bg-white;
	}
	button:hover {
		@apply bg-blue-400;
	}
	h2 {
		@apply font-bold text-lg mb-2;
	}
	div.roll-two {
		@apply border border-black rounded p-2 mb-2 bg-white;
	}
</style>
