<script lang="ts">
	import { clone } from '$lib/clone';
	import type { HangMan } from '$lib/types/hang-man-type';
	import { buildRequestHeaders } from '../../lib/build-request-headers';
	import { GameStatus } from '../../lib/enum/game-status.enum';
	import type { Word } from '../../lib/types/word.type';
	import HangManDisplay from './HangManDisplay.svelte';
	import HangmanDrawing from './HangmanDrawing.svelte';
	import HangManGameOptions from './HangManGameOptions.svelte';
	import HangManLetterButtons from './HangManLetterButtons.svelte';

	let word: Word = {};
	let game: HangMan = {};
	let Min = 4;
	let Max = 12;

	const getRandomWord = async () => {
		try {
			const result = await fetch('/api/word/random', {
				method: 'POST',
				body: JSON.stringify({ Min, Max })
			});
			console.log(result);
			if (result.ok) {
				word = await result.json();
				if (word.Id) createGame(word.Id);
				if (word.Length) newDisplay(word.Length);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const newDisplay = (length: number) => {
		display = [];
		wrong = [];
		correct = [];
		for (let i = 0; i < length; i++) display.push('');
		clearButtons();
		clearParts();
	};

	let wrong: string[] = [];
	let correct: string[] = [];
	let display: string[] = [];

	let drawHangMan = () => {};
	let clearButtons = () => {};
	let toggleButton = (letter: string, className: string) => {};
	let clearParts = () => {};

	const newGame = (event: any) => {
		Min = event.detail.Min;
		Max = event.detail.Max;
		getRandomWord();
	};

	const createGame = async (WordId: number) => {
		try {
			const result = await fetch('/api/hangman', {
				method: 'POST',
				body: JSON.stringify({ WordId }),
				headers: buildRequestHeaders()
			});
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const guess = async (event: any) => {
		if (!game.Id || !word.Word) return;
		const { Letter } = event.detail;
		const payload = {
			Id: game.Id,
			Word: word.Word,
			Letter
		};
		try {
			const result = await fetch('/api/hangman/guess', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			if (result.ok) {
				const { Found } = await result.json();
				if (Found) {
					correct.push(Letter);
					toggleButton(Letter, 'Correct');
				} else {
					wrong.push(Letter);
					toggleButton(Letter, 'Wrong');
				}
				setTimeout(() => {
					correct = clone(correct);
					wrong = clone(wrong);
				}, 100);
				updateDisplay(Letter);
				drawHangMan();
				reloadGame();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const updateDisplay = (letter: string) => {
		if (!word.Word) return;
		for (let i = 0; i < word.Word.length; i++) {
			if (letter.toLowerCase() === word.Word[i].toLowerCase()) {
				display[i] = letter.toUpperCase();
			}
		}
		setTimeout(() => (display = clone(display)), 100);
	};

	const reloadGame = async () => {
		if (!game.Id) return;
		try {
			const result = await fetch(`/api/hangman/${game.Id}`);
			if (result.ok) {
				game = await result.json();
				if (game.Status === GameStatus.Won) {
					clearButtons();
					clearParts();
				}
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<h2>Hang Man</h2>

<HangmanDrawing {wrong} bind:drawMan={drawHangMan} bind:clearParts />

{#if game && game.Status === 'Lost'}
	<div class="mx-2 my-4">The word was <b>{word.Word}</b></div>
{/if}

{#if game && game.Status === 'Playing'}
	<HangManDisplay {display} />
	<HangManLetterButtons on:guess={guess} bind:clearButtons bind:toggleButton />
{/if}

{#if game && game.Status !== 'Playing'}
	<HangManGameOptions {Min} {Max} on:newGame={newGame} />
{/if}

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
</style>
