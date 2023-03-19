<script lang="ts">
	import { clone } from '$lib/clone';
	import { railsRoot } from '$lib/constants';
	import type { HangMan } from '$lib/types/hang-man-type';
	import { userSession, type UserSessionData } from '$lib/user-session.writable';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { buildRequestHeaders } from '../../lib/build-request-headers';
	import { GameStatus } from '../../lib/enum/game-status.enum';
	import type { Word } from '../../lib/types/word.type';
	import HangManDirections from './HangManDirections.svelte';
	import HangManDisplay from './HangManDisplay.svelte';
	import HangmanDrawing from './HangmanDrawing.svelte';
	import HangManGameOptions from './HangManGameOptions.svelte';
	import HangManLetterButtons from './HangManLetterButtons.svelte';
	import InProgressHangMen from './InProgressHangMen.svelte';

	let word: Word = {};
	let game: HangMan = {};
	let inProgress: HangMan[] = []
	let Min = 4;
	let Max = 12;
	const session: UserSessionData = get(userSession);

	const getRandomWord = async () => {
		try {
			const result = await fetch(`${railsRoot}/api/word/random`, {
				method: 'POST',
				body: JSON.stringify({ Min, Max }),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				word = await result.json();
				if (word.id) createGame(word.id);
				if (word.Length) newDisplay(word.Length);
				console.log(word)
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
			const result = await fetch(`${railsRoot}/api/hang_man`, {
				method: 'POST',
				body: JSON.stringify({ WordId }),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const guess = async (event: any) => {
		if (!game.id || !word.Word) return;
		const { Letter } = event.detail;
		const payload = {
			Word: word.Word,
			Letter
		};
		try {
			const result = await fetch(`${railsRoot}/api/hang_man/${game.id}/guess`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: buildRequestHeaders(session)
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
		if (!game.id) return;
		try {
			const result = await fetch(`${railsRoot}/api/hang_man/${game.id}`);
			if (result.ok) {
				game = await result.json();
				if (game.Status === GameStatus.Won) {
					clearButtons();
					clearParts();
				}
				if (game.Status != 'Playing') loadInProgress()
			}
		} catch (error) {
			console.log(error);
		}
	};

	const loadInProgress = async () => {
		if (!session.Token) return
		try {
			const result = await fetch(`${railsRoot}/api/hang_man/progress`, {
				headers: buildRequestHeaders(session)
			})
			if (result.ok) {
				inProgress = await result.json()
				console.log(inProgress);
			}
		} catch (error) {
			console.log(error);
		}
	}

	const continueGame = async (event: any) => {
		if (!event.detail.id) return
		game.id = event.detail.id
		try {
			const result = await fetch(`${railsRoot}/api/hang_man/${game.id}`);
			if (result.ok) {
				game = await result.json();
				if (game.word) word = game.word
				if (word.Length) {
					display = [];
					wrong = game.Wrong ? game.Wrong.split(',') : [];
					correct = game.Correct ? game.Correct.split(',') : []
					clearButtons();
					clearParts();
					for (let i = 0; i < word.Length; i++) display.push('');
					setTimeout(() => {
						correct = clone(correct);
						wrong = clone(wrong);
						for (const Letter of wrong) {
							toggleButton(Letter,'Wrong');
							updateDisplay(Letter);
						}
						for (const Letter of correct) {
							toggleButton(Letter,'Correct');
							updateDisplay(Letter);
						}
						drawHangMan();
					}, 100);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	onMount(() =>  {
		loadInProgress()
	})
</script>

<svelte:head>
	<title>Hang Man Game</title>
</svelte:head>

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

{#if inProgress && inProgress.length && game && game.Status !== 'Playing'}
	<InProgressHangMen {inProgress} on:continueGame={continueGame} />
{/if}

<div class="scores-link">
	<a href="/hangman/scores">See Top Scores</a>
</div>

<HangManDirections />

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.scores-link {
		@apply mx-2 mt-4;
	}
</style>
