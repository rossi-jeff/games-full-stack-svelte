<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import { buildRequestHeaders } from '../../lib/build-request-headers';
	import { railsRoot } from '../../lib/constants';
	import { TenGrandCategory } from '../../lib/enum/ten-grand-category.enum';
	import type { ArgsTenGrandScore } from '../../lib/types/args-ten-grand-score.type';
	import type { FlagType } from '../../lib/types/flag.type';
	import type { TenGrandOption } from '../../lib/types/ten-grand-option.type';
	import type { TenGrandTurn } from '../../lib/types/ten-grand-turn.type';
	import type { TenGrand } from '../../lib/types/ten-grand.type';
	import { userSession, type UserSessionData } from '../../lib/user-session.writable';
	import DieFace from './DieFace.svelte';
	import TenGrandTurnDisplay from './TenGrandTurnDisplay.svelte';

	export let game: TenGrand = {};

	let turn: TenGrandTurn = {};
	let rollDice: number[] = [];
	let scoreDice: number[] = [];
	let flags: FlagType = {
		roll: false,
		score: false,
		options: false
	};
	let currentScore: ArgsTenGrandScore = {
		TurnId: turn.id ?? 0,
		Dice: [],
		Options: []
	};
	let selectedOptions: number[] = [];
	let Options: TenGrandOption[] = [];
	const session: UserSessionData = get(userSession);

	const dispatch = createEventDispatcher();

	const dragStart = (event: any) => {
		event.preventDefault();
		if (event.target) event.dataTransfer.setData('text', event.target.id);
		else if (event.detail) event.detail.dataTransfer.setData('text', event.detail.target.id);
	};

	const dragOver = (event: any) => {
		event.preventDefault();
	};

	const dragEnter = (event: any) => {
		let { target } = event;
		if (target) {
			while (
				target &&
				!(target.classList.contains('roll-dice') || target.classList.contains('score-dice'))
			) {
				target = target.parentElement;
			}
			target.classList.add('over');
			setTimeout(() => {
				target.classList.remove('over');
			}, 500);
		}
	};

	const drop = (event: any) => {
		event.preventDefault();
		event.stopPropagation();
		const data = event.dataTransfer.getData('text');
		let [from, idx, face] = data.split('-');
		idx = parseInt(idx);
		face = parseInt(face);
		let { target } = event;
		while (
			target &&
			!(target.classList.contains('roll-dice') || target.classList.contains('score-dice'))
		) {
			target = target.parentElement;
		}
		if (target.classList.contains('score-dice')) {
			if (from === 'score') return;
			scoreDice.push(face);
			rollDice.splice(idx, 1);
			flags.roll = false;
			flags.score = false;
		} else {
			if (from === 'roll') return;
			rollDice.push(face);
			scoreDice.splice(idx, 1);
			flags.roll = false;
			flags.score = false;
		}
		setTimeout(() => {
			flags.roll = true;
			flags.score = true;
			getOptions();
		}, 25);
	};

	const roll = async () => {
		if (!game.id) return
		let Quantity = rollDice.length || 6;
		try {
			flags.roll = false;
			const result = await fetch(`${railsRoot}/api/ten_grand/${game.id}/roll`, {
				method: 'POST',
				body: JSON.stringify({ Quantity }),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				rollDice = await result.json();
				flags.roll = true;
				getOptions();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getOptions = async () => {
		let Dice = scoreDice;
		selectedOptions = [];
		try {
			flags.options = false;
			const result = await fetch(`${railsRoot}/api/ten_grand/options`, {
				method: 'POST',
				body: JSON.stringify({ Dice }),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				const data = await result.json();
				Options = data.Options;
				flags.options = true;
			}
		} catch (error) {
			console.log(error);
		}
	};

	const scoreOption = async () => {
		if (!selectedOptions.length || !game.id) return;
		currentScore.TurnId = turn.id || 0;
		currentScore.Dice = [...scoreDice];
		currentScore.Options = [];
		let crapOut = false;
		for (const idx of selectedOptions) {
			const option = Options[idx];
			currentScore.Options.push(option);
			if (option.Category === TenGrandCategory.CrapOut) crapOut = true;
		}
		if (crapOut) {
			currentScore.Dice = [...scoreDice, ...rollDice];
			rollDice = [];
		}
		scoreDice = [];
		flags.roll = false;
		flags.score = false;
		flags.options = false;
		try {
			const result = await fetch(`${railsRoot}/api/ten_grand/${game.id}/score`, {
				method: 'POST',
				body: JSON.stringify(currentScore),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				turn = await result.json();
				flags.roll = true;
				flags.score = true;
				if (!rollDice.length) turn = {};
				reloadGame();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const reloadGame = () => dispatch('reloadGame');
</script>

<div class="ten-grand-turn-form">
	<div class="game-score-header">
		<div>
			<strong>Turns</strong>
			{game.turns ? game.turns.length : 0}
		</div>
		<div>
			<strong>Status</strong>
			{game.Status}
		</div>
		<div>
			<strong>Total Score</strong>
			{game.Score}
		</div>
	</div>
	<div class="top-row">
		<div class="roll-container">
			<h3>Roll</h3>
			<div class="roll-dice" on:dragover={dragOver} on:dragenter={dragEnter} on:drop={drop}>
				{#if flags.roll}
					{#each rollDice as face, idx}
						<DieFace {face} {idx} draggable={true} from="roll" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
		</div>
		<div class="score-container">
			<h3>Score</h3>
			<div class="score-dice" on:dragover={dragOver} on:dragenter={dragEnter} on:drop={drop}>
				{#if flags.score}
					{#each scoreDice as face, idx}
						<DieFace {face} {idx} draggable={true} from="score" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
		</div>
	</div>
	<div class="bottom-row">
		{#if flags.options}
			<div class="options-list">
				{#each Options as option, idx}
					<div class="option">
						<div>
							<input
								type="checkbox"
								name="option"
								id="option"
								value={idx}
								bind:group={selectedOptions}
							/>
						</div>
						<div class="category">{option.Category}</div>
						<div class="score">{option.Score}</div>
					</div>
				{/each}
				<button class="mt-2 mx-2" on:click={scoreOption}> Score </button>
			</div>
		{:else}
			<button class="mt-2 mx-2" on:click={roll}> Roll </button>
		{/if}
	</div>
	{#if turn && turn.id}
		<div class="current-turn">
			<TenGrandTurnDisplay {turn} />
		</div>
	{/if}
</div>

<style>
	div.ten-grand-turn-form {
		@apply p-4 bg-green-600 rounded mb-2;
	}
	div.game-score-header {
		@apply flex flex-wrap justify-between mb-2;
	}
	div.top-row {
		@apply flex flex-wrap;
	}
	div.roll-container {
		@apply mr-2 mb-2;
	}
	h3 {
		@apply font-bold text-lg mb-2;
	}
	div.roll-dice,
	div.score-dice {
		@apply flex flex-wrap p-2 h-20 border border-dashed border-yellow-400 rounded mb-4 min-w-[10rem];
	}
	:global(div.roll-dice div.ten-grand-die, div.score-dice div.ten-grand-die) {
		@apply mr-2 cursor-move;
	}
	:global(div.over) {
		border: dashed red !important;
	}
	div.options-list {
		@apply bg-white rounded p-2;
	}
	button {
		@apply border border-black rounded py-1 px-2 mr-2 mb-2 bg-white;
	}
	button:hover {
		@apply bg-blue-400;
	}
	div.option {
		@apply flex border border-dashed border-b-gray-500 px-2;
	}
	div.category {
		@apply flex-grow;
	}
	input {
		@apply mr-2;
	}
	div.current-turn {
		@apply bg-white rounded p-2 mt-2;
	}
</style>
