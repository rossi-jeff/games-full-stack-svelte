<script lang="ts">
	import { TenGrandCategory } from '../../lib/enum/ten-grand-category.enum';
	import type { ArgsTenGrandOptions } from '../../lib/types/args-ten-grand-options.type';
	import type { FlagType } from '../../lib/types/flag.type';
	import type { TenGrandOption } from '../../lib/types/ten-grand-option.type';
	import DieFace from './DieFace.svelte';
	import ScoreGrid from './ScoreGrid.svelte';
	import type { TenGrand } from '../../lib/types/ten-grand.type';

	let Dice: number[] = [];
	let toScore: number[] = [];
	let flags: FlagType = {
		rolled: false,
		scoreReady: false,
		options: false
	};
	``;
	let Options: TenGrandOption[] = [];
	let selectedOptions: number[] = [];
	let Scored: TenGrandOption[] = [];
	let game: TenGrand = {};

	const rollDice = async () => {
		let Quantity = Dice.length || 6;
		try {
			flags.rolled = false;
			flags.options = false;
			const result = await fetch('/api/tengrand/roll', {
				method: 'POST',
				body: JSON.stringify({ Quantity })
			});
			if (result.ok) {
				Dice = await result.json();
				flags.rolled = true;
				Options = [];
				Options.push({ Category: TenGrandCategory.CrapOut, Score: 0 });
				flags.options = true;
			}
		} catch (error) {
			console.log(error);
		}
	};

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
			let classSet = false;
			while (!classSet) {
				if (target && target.classList.contains('dice-container')) {
					target.classList.add('over');
					classSet = true;
					setTimeout(() => {
						target.classList.remove('over');
					}, 750);
				} else if (target.parentElement) {
					target = target.parentElement;
				} else {
					classSet = true;
				}
			}
		}
	};

	const dragExit = (event: any) => {
		let { target } = event;
		if (target) {
			let classSet = false;
			while (!classSet) {
				if (target && target.classList.contains('over')) {
					target.classList.remove('over');
				} else if (target.parentElement) {
					target = target.parentElement;
				} else {
					classSet = true;
				}
			}
		}
	};

	const dropScoring = (event: any) => {
		event.preventDefault();
		event.stopPropagation();
		const data = event.dataTransfer.getData('text');
		let [from, idx, face] = data.split('-');
		console.log({ from, idx, face });
		if (from === 'scoring') return;
		idx = parseInt(idx);
		face = parseInt(face);
		flags.rolled = false;
		flags.scoreReady = false;
		toScore.push(face);
		Dice.splice(idx, 1);
		setTimeout(() => {
			flags.rolled = true;
			flags.scoreReady = true;
			getOptions();
		}, 25);
	};

	const dropRoll = (event: any) => {
		event.preventDefault();
		event.stopPropagation();
		const data = event.dataTransfer.getData('text');
		let [from, idx, face] = data.split('-');
		console.log({ from, idx, face });
		if (from === 'roll') return;
		idx = parseInt(idx);
		face = parseInt(face);
		flags.rolled = false;
		flags.scoreReady = false;
		Dice.push(face);
		toScore.splice(idx, 1);
		setTimeout(() => {
			flags.rolled = true;
			flags.scoreReady = true;
			getOptions();
		}, 25);
	};

	const getOptions = async () => {
		if (!toScore.length) return;
		const payload: ArgsTenGrandOptions = {
			Dice: toScore
		};
		flags.options = false;
		try {
			const result = await fetch('/api/tengrand/options', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			if (result.ok) {
				const data = await result.json();
				Options = data.Options;
				selectedOptions = [];
				setTimeout(() => {
					flags.options = true;
				}, 25);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const scoreOption = () => {
		if (!selectedOptions.length) return;
		let crapOut = false;
		for (const idx of selectedOptions) {
			const option = Options[idx];
			if (option.Category === TenGrandCategory.CrapOut) crapOut = true;
			Scored.push(option);
		}
		Options = [];
		toScore = [];
		if (crapOut) Dice = [];
		flags.options = false;
		flags.rolled = false;
		flags.scoreReady = false;
		console.log(Scored);

		setTimeout(() => {
			flags.rolled = true;
			flags.scoreReady = true;
		}, 25);
	};
</script>

<h2>Ten Grand</h2>

<div class="ten-grand-turn">
	<h3>Score</h3>
	<div
		class="ten-grand-score-dice dice-container"
		on:dragover={dragOver}
		on:dragenter={dragEnter}
		on:dragleave={dragExit}
		on:drop={dropScoring}
	>
		{#if flags.scoreReady}
			{#each toScore as face, idx}
				<DieFace {face} {idx} draggable={true} from="score" on:dragStart={dragStart} />
			{/each}
		{/if}
	</div>
	<div
		class="ten-grand-dice dice-container"
		on:dragover={dragOver}
		on:dragenter={dragEnter}
		on:dragleave={dragExit}
		on:drop={dropRoll}
	>
		{#if flags.rolled}
			{#each Dice as face, idx}
				<DieFace {face} {idx} draggable={true} from="roll" on:dragStart={dragStart} />
			{/each}
		{/if}
	</div>

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
			<button class="mt-2 mx-2" on:click={scoreOption}>Score</button>
		</div>
	{:else}
		<button on:click={rollDice}>Roll</button>
	{/if}
</div>

<ScoreGrid />

<style>
	div.ten-grand-turn {
		@apply mx-2 p-4 h-screen bg-green-600 rounded;
	}
	div.ten-grand-dice,
	div.ten-grand-score-dice {
		@apply flex flex-wrap p-2 h-20 border border-dashed border-yellow-400 rounded mb-4;
	}
	:global(div.ten-grand-dice div.ten-grand-die) {
		@apply cursor-move mr-2;
	}
	:global(div.ten-grand-score-dice div.ten-grand-die) {
		@apply cursor-pointer mr-2;
	}
	button {
		@apply border border-black rounded py-1 px-2 mr-2 mb-2 bg-white;
	}
	button:hover {
		@apply bg-blue-400;
	}
	:global(div.dice-container.over) {
		border: dashed red !important;
	}
	div.options-list {
		@apply bg-white rounded p-2;
	}
	div.option {
		@apply flex flex-wrap mx-2 border border-b-gray-500 border-dashed px-2;
	}
	div.option div.category {
		@apply flex-grow;
	}
</style>
