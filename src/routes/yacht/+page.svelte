<script lang="ts">
	import { YachtCategory } from '$lib/enum/yacht-category.enum';
	import type { YachtScoreOption } from '$lib/types/yacht-score-option.type';
	import type { YachtTurn } from '$lib/types/yacht-turn.type';
	import type { Yacht } from '$lib/types/yacht.type';
	import RollOne from './RollOne.svelte';
	import RollThree from './RollThree.svelte';
	import RollTwo from './RollTwo.svelte';
	import YachtScoreCard from './YachtScoreCard.svelte';
	import YachtScoreOptionList from './YachtScoreOptionList.svelte';

	let game: Yacht = {};
	let turn: YachtTurn = {};
	let options: YachtScoreOption[] = [];
	let flags: { firstRoll: boolean; secondRoll: boolean; thirdRoll: boolean } = {
		firstRoll: false,
		secondRoll: false,
		thirdRoll: false
	};
</script>

{#if game && (!game.Id || game.turns?.length === Object.values(YachtCategory).length)}
	<button>New Game</button>
{:else}
	{#if turn && turn.RollOne}
		<RollOne {turn} {flags} />
	{:else}
		<button>First Roll</button>
	{/if}

	{#if turn && turn.RollTwo}
		<RollTwo {turn} {flags} />
	{/if}

	{#if turn && turn.RollThree}
		<RollThree {turn} {flags} />
	{/if}

	{#if options && options.length}
		<YachtScoreOptionList {options} />
	{/if}
{/if}

{#if game && game.turns && game.turns.length}
	<YachtScoreCard turns={game.turns} />
{/if}

<style>
	button {
		@apply border border-black rounded py-1 px-2 mr-2 mb-2;
	}
	button:hover {
		@apply bg-blue-400;
	}
</style>
