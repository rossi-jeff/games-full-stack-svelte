<script lang="ts">
	import type { YachtScoreOption } from '$lib/types/yacht-score-option.type';
	import type { YachtTurn } from '$lib/types/yacht-turn.type';
	import type { Yacht } from '$lib/types/yacht.type';
	import RollOne from './RollOne.svelte';
	import RollThree from './RollThree.svelte';
	import RollTwo from './RollTwo.svelte';
	import YachtScoreOptionList from './YachtScoreOptionList.svelte';

	let game: Yacht = {};
	let turn: YachtTurn = {};
	let options: YachtScoreOption[] = [];
</script>

{#if turn && turn.RollOne}
	<RollOne {turn} />
{/if}

{#if turn && turn.RollTwo}
	<RollTwo {turn} />
{/if}

{#if turn && turn.RollThree}
	<RollThree {turn} />
{/if}

{#if options && options.length}
	<YachtScoreOptionList {options} />
{/if}

{#if game && !game.Id}
	<button>New Game</button>
{/if}

<style>
	button {
		@apply border border-black rounded py-1 px-2 mr-2 mb-2;
	}
	button:hover {
		@apply bg-blue-400;
	}
</style>
