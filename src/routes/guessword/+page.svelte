<script lang="ts">
	import type { Word } from '$lib/types/word.type';
	import { userSession, type UserSessionData } from '$lib/user-session.writable';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { buildRequestHeaders } from '../../lib/build-request-headers';
	import { railsRoot } from '../../lib/constants';
	import { Rating } from '../../lib/enum/rating.enum';
	import type { ArgsGuessWordGuess } from '../../lib/types/args-guess-word-guess';
	import type { ArgsGuessWordHint } from '../../lib/types/args-guess-word-hint.type';
	import type { FlagType } from '../../lib/types/flag.type';
	import type { GuessWordGuess } from '../../lib/types/guess-word-guess.type';
	import type { GuessWord } from '../../lib/types/guess-word.type';
	import GuessWordDirections from './GuessWordDirections.svelte';
	import GuessWordGameOptions from './GuessWordGameOptions.svelte';
	import GuessWordGuessForm from './GuessWordGuessForm.svelte';
	import GuessWordGuessList from './GuessWordGuessList.svelte';
	import HintList from './HintList.svelte';
	import InProgressGuessWords from './InProgressGuessWords.svelte';

	let word: Word = {};
	let game: GuessWord = {};
	let inProgress: GuessWord[] = [];
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
	const session: UserSessionData = get(userSession);

	const getRandomWord = async () => {
		try {
			const result = await fetch(`${railsRoot}/api/word/random`, {
				method: 'POST',
				body: JSON.stringify({ Length }),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				word = await result.json();
				if (word.Length) hintArgs.Length = word.Length;
				if (word.id) createGame(word.id);
				console.log(word);
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
			hintArgs.Green[i] = '';
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
			const result = await fetch(`${railsRoot}/api/guess_word`, {
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

	const sendGuess = async (event: { detail: { Guess: string } }) => {
		const { Guess } = event.detail;
		console.log({ game, word });
		if (!game.id || !word.Word) return;
		const payload: ArgsGuessWordGuess = {
			Word: word.Word,
			Guess
		};
		try {
			const result = await fetch(`${railsRoot}/api/guess_word/${game.id}/guess`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: buildRequestHeaders(session)
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
			const result = await fetch(`${railsRoot}/api/guess_word/hint`, {
				method: 'POST',
				body: JSON.stringify(hintArgs),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				hints = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const reloadGame = async () => {
		if (!game.id) return;
		try {
			const result = await fetch(`${railsRoot}/api/guess_word/${game.id}`);
			if (result.ok) {
				game = await result.json();
				console.log(game);
				if (game.word) word = game.word;
				if (word.Length) hintArgs.Length = word.Length;
				if (game && game.guesses) buildHintArgs(game.guesses);
				if (game.word && game.word.Length) Length = game.word.Length;
				if (game.Status != 'Playing') loadInProgress();
				getHints();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const loadInProgress = async () => {
		if (!session.Token) return;
		try {
			const result = await fetch(`${railsRoot}/api/guess_word/progress`, {
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				inProgress = await result.json();
				console.log(inProgress);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const continueGame = (event: any) => {
		if (!event.detail.id) return;
		game.id = event.detail.id;
		reloadGame();
	};

	onMount(() => {
		loadInProgress();
	});
</script>

<svelte:head>
	<title>Guess Word Game</title>
</svelte:head>

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

{#if inProgress && inProgress.length && game && game.Status !== 'Playing'}
	<InProgressGuessWords {inProgress} on:continueGame={continueGame} />
{/if}

{#if game && game.Status !== 'Playing'}
	<div class="scores-link">
		<a href="/guessword/scores">See Top Scores</a>
	</div>

	<GuessWordDirections />
{/if}

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
