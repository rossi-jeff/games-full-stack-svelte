<script lang="ts">
	import { get } from 'svelte/store';
	import { buildRequestHeaders } from '../../lib/build-request-headers';
	import { GameStatus } from '../../lib/enum/game-status.enum';
	import type { TenGrand } from '../../lib/types/ten-grand.type';
	import { userSession, type UserSessionData } from '../../lib/user-session.writable';
	import TenGrandDirections from './TenGrandDirections.svelte';
	import TenGrandTurnForm from './TenGrandTurnForm.svelte';
	import TenGrandTurns from './TenGrandTurns.svelte';

	let game: TenGrand = {};
	const session: UserSessionData = get(userSession);

	const createGame = async () => {
		try {
			const result = await fetch('/api/tengrand', {
				method: 'POST',
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const reloadGame = async () => {
		if (!game.Id) return;
		try {
			const result = await fetch(`/api/tengrand/${game.Id}`);
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<h2>Ten Grand</h2>

<div class="ten-grand">
	{#if game && game.Id}
		<TenGrandTurnForm {game} on:reloadGame={reloadGame} />
	{:else}
		<button on:click={createGame}>New Game</button>
	{/if}
	{#if game && game.Status === GameStatus.Won}
		<button on:click={createGame}>New Game</button>
	{/if}
	{#if game.turns}
		<TenGrandTurns turns={game.turns} />
	{/if}
</div>

<div class="scores-link">
	<a href="/tengrand/scores">See Top Scores</a>
</div>

<TenGrandDirections />

<style>
	button {
		@apply border border-black rounded py-1 px-2 mr-2 mb-2 bg-white;
	}
	button:hover {
		@apply bg-blue-400;
	}
	div.ten-grand {
		@apply mx-2;
	}
	h2 {
		@apply font-bold text-xl mb-2 mx-2;
	}
	div.scores-link {
		@apply mx-2 mt-4;
	}
</style>
