<script lang="ts">
	import type { YachtTurn } from '$lib/types/yacht-turn.type';
	import FiveDice from './FiveDice.svelte';

	export let turn: YachtTurn = {};
	export let flag: boolean = false;

	const Dice: number[] = turn.RollThree ? turn.RollThree.split(',').map((d) => parseInt(d)) : [];
	let Keep: number[] = [];
</script>

<div class="roll-three">
	<h2>Roll Three</h2>
	<FiveDice {Dice} {flag} />
</div>

<style>
	h2 {
		@apply font-bold text-lg mb-2;
	}
	div.roll-three {
		@apply border border-black rounded p-2 mb-2;
	}
</style>
