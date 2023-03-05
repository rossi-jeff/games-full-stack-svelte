<script lang="ts">
	import { YachtCategory } from '$lib/enum/yacht-category.enum';
	import type { ArgsYachtRoll } from '$lib/types/args-yacht-roll.type';
	import type { ArgsYachtScore } from '$lib/types/args-yacht-score.type';
	import type { FlagType } from '$lib/types/flag.type';
	import type { YachtScoreOption } from '$lib/types/yacht-score-option.type';
	import type { YachtTurn } from '$lib/types/yacht-turn.type';
	import type { Yacht } from '$lib/types/yacht.type';
	import { userSession, type UserSessionData } from '$lib/user-session.writable';
	import { get } from 'svelte/store';
	import { buildRequestHeaders } from '../../lib/build-request-headers';
	import RollOne from './RollOne.svelte';
	import RollThree from './RollThree.svelte';
	import RollTwo from './RollTwo.svelte';
	import YachtDirections from './YachtDirections.svelte';
	import YachtScoreCard from './YachtScoreCard.svelte';
	import YachtScoreOptionList from './YachtScoreOptionList.svelte';
	import { railsRoot } from '../../lib/constants';

	let game: Yacht = {};
	let turn: YachtTurn = {};
	let options: YachtScoreOption[] = [];
	let flags: FlagType = {
		firstRoll: false,
		secondRoll: false,
		thirdRoll: false,
		scored: false
	};
	const session: UserSessionData = get(userSession);

	const createGame = async () => {
		try {
			const result = await fetch(`${railsRoot}/api/yacht`, {
				method: 'POST',
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				game = await result.json();
				console.log(game);
				
			}
		} catch (error) {
			console.log(error);
		}
	};

	const roll = async (Keep: number[] = []) => {
		if (!game.id) return;
		const payload: ArgsYachtRoll = {
			Keep
		};
		try {
			const result = await fetch(`${railsRoot}/api/yacht/${game.id}/roll`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				const { Turn, Options } = await result.json();
				turn = Turn;
				options = Options;
				// reloadGame();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const scoreTurn = async (event: any) => {
		if (!turn.id || !game.id) return;
		flags.scored = true;
		const { Category } = event.detail;
		const payload: ArgsYachtScore = {
			TurnId: turn.id,
			Category
		};
		try {
			const result = await fetch(`${railsRoot}/api/yacht/${game.id}/score`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: buildRequestHeaders(session)
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
		if (!game.id) return;
		try {
			const result = await fetch(`${railsRoot}/api/yacht/${game.id}`);
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<h2>Yacht</h2>

<div class="yacht">
	{#if game && (!game.id || game.turns?.length === Object.values(YachtCategory).length)}
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
		<YachtScoreCard turns={game.turns} total={game.Total ?? 0} />
	{/if}
</div>

<div class="scores-link">
	<a href="/yacht/scores">See Top Scores</a>
</div>

<YachtDirections />

<style>
	button {
		@apply border border-black rounded py-1 px-2 mr-2 mb-2 bg-white;
	}
	button:hover {
		@apply bg-blue-400;
	}
	div.yacht {
		@apply mx-2;
	}
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.scores-link {
		@apply mx-2 mt-4;
	}
</style>
