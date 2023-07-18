<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { buildRequestHeaders } from '../../lib/build-request-headers';
	import { railsRoot } from '../../lib/constants';
	import { GameStatus } from '../../lib/enum/game-status.enum';
	import type { TenGrand } from '../../lib/types/ten-grand.type';
	import { userSession, type UserSessionData } from '../../lib/user-session.writable';
	import InProgressTenGrands from './InProgressTenGrands.svelte';
	import TenGrandDirections from './TenGrandDirections.svelte';
	import TenGrandTurnForm from './TenGrandTurnForm.svelte';
	import TenGrandTurns from './TenGrandTurns.svelte';

	let game: TenGrand = {};
	let inProgress: TenGrand[] = [];
	const session: UserSessionData = get(userSession);

	const createGame = async () => {
		try {
			const result = await fetch(`${railsRoot}/api/ten_grand`, {
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
		if (!game.id) return;
		try {
			const result = await fetch(`${railsRoot}/api/ten_grand/${game.id}`);
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const loadInProgress = async () => {
		if (!session.Token) return;
		try {
			const result = await fetch(`${railsRoot}/api/ten_grand/progress`, {
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
	<title>Ten Grand Game</title>
</svelte:head>

<h2>Ten Grand</h2>

<div class="ten-grand">
	{#if game && game.id && game.Status == 'Playing'}
		<TenGrandTurnForm {game} on:reloadGame={reloadGame} />
	{:else}
		<button on:click={createGame}>New Game</button>
	{/if}
	{#if game.turns}
		<TenGrandTurns turns={game.turns} />
	{/if}
</div>

{#if inProgress && inProgress.length && game && game.Status !== 'Playing'}
	<InProgressTenGrands {inProgress} on:continueGame={continueGame} />
{/if}

{#if game && game.Status !== 'Playing'}
	<div class="scores-link">
		<a href="/tengrand/scores">See Top Scores</a>
	</div>

	<TenGrandDirections />
{/if}

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
