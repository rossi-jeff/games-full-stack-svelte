<script lang="ts">
	import type { ArgsCodeBreakerCreate } from '../../lib/types/args-code-breaker-create.type';
	import type { CodeBreaker } from '../../lib/types/code-breaker.type';
	import CodeBreakerGameOptions from './CodeBreakerGameOptions.svelte';
	import CodeBreakerGuessForm from './CodeBreakerGuessForm.svelte';
	import CodeBreakerGuessList from './CodeBreakerGuessList.svelte';

	let game: CodeBreaker = {};
	let available: string[] = [];
	let columns: number = 4;

	const startGame = async (event: { detail: ArgsCodeBreakerCreate }) => {
		const { Colors, Columns } = event.detail;
		available = Colors;
		columns = Columns;
		try {
			const result = await fetch('/api/codebreaker', {
				method: 'POST',
				body: JSON.stringify({ Colors, Columns })
			});
			if (result.ok) {
				game = await result.json();
				console.log(game);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const sendGuess = async (event: { detail: { selected: string[] } }) => {
		const { selected: Colors } = event.detail;
		const payload = {
			Id: game.Id,
			Colors
		};
		try {
			const result = await fetch('/api/codebreaker/guess', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			if (result.ok) {
				const guess = await result.json();
				if (!game.guesses) game.guesses = [];
				game.guesses.push(guess);
				reloadGame();
			} else {
				console.log(result);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const reloadGame = async () => {
		if (!game.Id) return;
		try {
			const result = await fetch(`/api/codebreaker/${game.Id}`);
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

{#if game && game.guesses && game.guesses.length > 0}
	<CodeBreakerGuessList guesses={game.guesses} />
{/if}

{#if game && game.Status !== 'Playing'}
	<CodeBreakerGameOptions on:startGame={startGame} />
{/if}

{#if game && game.Status === 'Playing'}
	<CodeBreakerGuessForm {available} {columns} on:sendGuess={sendGuess} />
{/if}
