<script lang="ts">
	import type { Word } from '$lib/types/word.type';
	import { buildRequestHeaders } from '../../lib/build-request-headers';
	import { Rating } from '../../lib/enum/rating.enum';
	import type { ArgsGuessWordGuess } from '../../lib/types/args-guess-word-guess';
	import type { ArgsGuessWordHint } from '../../lib/types/args-guess-word-hint.type';
	import type { FlagType } from '../../lib/types/flag.type';
	import type { GuessWordGuess } from '../../lib/types/guess-word-guess.type';
	import type { GuessWord } from '../../lib/types/guess-word.type';
	import GuessWordGameOptions from './GuessWordGameOptions.svelte';
	import GuessWordGuessForm from './GuessWordGuessForm.svelte';
	import GuessWordGuessList from './GuessWordGuessList.svelte';
	import HintList from './HintList.svelte';

	let word: Word = {};
	let game: GuessWord = {};
	let Length: number = 5;
	let hintArgs: ArgsGuessWordHint = {
		Length,
		Green: [],
		Gray: [],
		Brown: []
	};
	let flags: FlagType = {
		showHints: false
	};
	let hints: string[] = [];

	const getRandomWord = async () => {
		try {
			const result = await fetch('/api/word/random', {
				method: 'POST',
				body: JSON.stringify({ Length })
			});
			if (result.ok) {
				word = await result.json();
				if (word.Length) hintArgs.Length = word.Length;
				if (word.Id) createGame(word.Id);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const newGame = (event: { detail: { Length: number } }) => {
		Length = event.detail.Length;
		getRandomWord();
	};

	const buildHintArgs = (guesses: GuessWordGuess[]) => {
		hintArgs.Brown = [];
		hintArgs.Gray = [];
		hintArgs.Green = [];
		for (let i = 0; i < hintArgs.Length; i++) {
			hintArgs.Green[i] = null;
			hintArgs.Brown[i] = [];
		}
		for (const guess of guesses) {
			if (guess.Guess && guess.ratings) {
				for (let i = 0; i < guess.ratings.length; i++) {
					if (guess.ratings[i].Rating === Rating.Green) {
						hintArgs.Green[i] = guess.Guess[i];
					} else if (guess.ratings[i].Rating === Rating.Brown) {
						hintArgs.Brown[i].push(guess.Guess[i]);
					} else if (guess.ratings[i].Rating === Rating.Gray) {
						hintArgs.Gray.push(guess.Guess[i]);
					}
				}
			}
			// no dupes in arrays
			for (let i = 0; i < hintArgs.Length; i++) {
				hintArgs.Brown[i] = [...new Set(hintArgs.Brown[i])];
			}
			hintArgs.Gray = [...new Set(hintArgs.Gray)];
		}
	};

	const createGame = async (WordId: number) => {
		try {
			const result = await fetch('/api/guessword', {
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

	const sendGuess = async (event: { detail: { Guess: string } }) => {
		const { Guess } = event.detail;
		if (!game.Id || !word.Word) return;
		const payload: ArgsGuessWordGuess = {
			Id: game.Id,
			Word: word.Word,
			Guess
		};
		try {
			const result = await fetch('/api/guessword/guess', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			if (result.ok) {
				const guess = await result.json();
				if (!game.guesses) game.guesses = [];
				game.guesses.push(guess);
				reloadGame();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getHints = async () => {
		if (!flags.showHints) return;
		try {
			const result = await fetch('/api/guessword/hint', {
				method: 'POST',
				body: JSON.stringify(hintArgs)
			});
			if (result.ok) {
				hints = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const reloadGame = async () => {
		if (!game.Id) return;
		try {
			const result = await fetch(`/api/guessword/${game.Id}`);
			if (result.ok) {
				game = await result.json();
				console.log(game);
				if (game && game.guesses) buildHintArgs(game.guesses);
				getHints();
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<h2>Guess Word</h2>

{#if game && game.guesses && game.guesses.length}
	<GuessWordGuessList guesses={game.guesses} />
{/if}

{#if game && game.Status === 'Lost'}
	<div class="mx-2 my-4">The word was <b>{word.Word}</b></div>
{/if}

{#if game && game.Status === 'Playing'}
	<GuessWordGuessForm {Length} on:sendGuess={sendGuess} />
	<div class="hint-check-box">
		<input type="checkbox" name="show-hints" id="show-hints" bind:checked={flags.showHints} />
		<label for="show-hints">Show Hints</label>
	</div>
{/if}

{#if flags.showHints && hints && hints.length && game && game.Status === 'Playing'}
	<HintList {hints} />
{/if}

{#if game && game.Status !== 'Playing'}
	<GuessWordGameOptions on:newGame={newGame} />
{/if}

<div class="scores-link">
	<a href="/guessword/scores">See Top Scores</a>
</div>

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.hint-check-box {
		@apply mx-2 mb-2;
	}
	div.scores-link {
		@apply mx-2 mt-4;
	}
</style>
