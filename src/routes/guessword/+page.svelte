<script lang="ts">
	import type { Word } from '$lib/types/word.type';
	import type { ArgsGuessWordGuess } from '../../lib/types/args-guess-word-guess';
	import type { GuessWord } from '../../lib/types/guess-word.type';
	import GuessWordGameOptions from './GuessWordGameOptions.svelte';
	import GuessWordGuessForm from './GuessWordGuessForm.svelte';
	import GuessWordGuessList from './GuessWordGuessList.svelte';

	let word: Word = {};
	let game: GuessWord = {};
	let Length: number = 5;

	const getRandomWord = async () => {
		try {
			const result = await fetch('/api/word/random', {
				method: 'POST',
				body: JSON.stringify({ Length })
			});
			if (result.ok) {
				word = await result.json();
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

	const createGame = async (WordId: number) => {
		try {
			const result = await fetch('/api/guessword', {
				method: 'POST',
				body: JSON.stringify({ WordId })
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

	const reloadGame = async () => {
		if (!game.Id) return;
		try {
			const result = await fetch(`/api/guessword/${game.Id}`);
			if (result.ok) {
				game = await result.json();
				console.log(game);
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

{#if game && game.guesses && game.guesses.length}
	<GuessWordGuessList guesses={game.guesses} />
{/if}

{#if game && game.Status === 'Lost'}
	<div class="mx-2 my-4">The word was <b>{word.Word}</b></div>
{/if}

{#if game && game.Status === 'Playing'}
	<GuessWordGuessForm {Length} on:sendGuess={sendGuess} />
{/if}

{#if game && game.Status !== 'Playing'}
	<GuessWordGameOptions on:newGame={newGame} />
{/if}
