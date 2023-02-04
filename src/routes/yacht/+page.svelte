<script lang="ts">
	import { YachtCategory } from '$lib/enum/yacht-category.enum';
	import type { ArgsYachtRoll } from '$lib/types/args-yacht-roll.type';
	import type { ArgsYachtScore } from '$lib/types/args-yacht-score.type';
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
	type YachtFlags = {
		[key: string]: boolean;
	};
	let flags: YachtFlags = {
		firstRoll: false,
		secondRoll: false,
		thirdRoll: false,
		scored: false
	};

	const createGame = async () => {
		try {
			const result = await fetch('/api/yacht', { method: 'POST' });
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const roll = async (Keep: number[] = []) => {
		if (!game.Id) return;
		const payload: ArgsYachtRoll = {
			YachtId: game.Id,
			Keep
		};
		try {
			const result = await fetch('/api/yacht/roll', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			if (result.ok) {
				const { Turn, Options } = await result.json();
				turn = Turn;
				options = Options;
			}
		} catch (error) {
			console.log(error);
		}
	};

	const scoreTurn = async (event: any) => {
		if (!turn.Id) return;
		flags.scored = true;
		const { Category } = event.detail;
		const payload: ArgsYachtScore = {
			TurnId: turn.Id,
			Category
		};
		try {
			const result = await fetch('/api/yacht/score', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			if (result.ok) {
				await result.json();
				turn = {};
				options = [];
				for (const key in flags) flags[key] = false;
				reloadGame();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const firstRoll = (event: any) => {
		flags.firstRoll = true;
		roll([]);
	};

	const secondRoll = (event: any) => {
		flags.secondRoll = true;
		const { Keep } = event.detail;
		roll(Keep);
	};

	const thirdRoll = (event: any) => {
		flags.thirdRoll = true;
		const { Keep } = event.detail;
		roll(Keep);
	};

	const reloadGame = async () => {
		if (!game.Id) return;
		try {
			const result = await fetch(`/api/yacht/${game.Id}`);
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="yacht">
	{#if game && (!game.Id || game.turns?.length === Object.values(YachtCategory).length)}
		<button on:click={createGame}>New Game</button>
	{:else}
		{#if turn && turn.RollOne}
			<RollOne {turn} flag={flags.secondRoll} on:roll={secondRoll} />
		{:else}
			<button on:click={firstRoll}>First Roll</button>
		{/if}

		{#if turn && turn.RollTwo}
			<RollTwo {turn} flag={flags.thirdRoll} on:roll={thirdRoll} />
		{/if}

		{#if turn && turn.RollThree}
			<RollThree {turn} flag={flags.thirdRoll} />
		{/if}

		{#if options && options.length}
			<YachtScoreOptionList {options} flag={flags.scored} on:score={scoreTurn} />
		{/if}
	{/if}

	{#if game && game.turns && game.turns.length}
		<YachtScoreCard turns={game.turns} />
	{/if}
</div>

<style>
	button {
		@apply border border-black rounded py-1 px-2 mr-2 mb-2;
	}
	button:hover {
		@apply bg-blue-400;
	}
	div.yacht {
		@apply mx-2;
	}
</style>
