<script lang="ts">
	import type { SeaBattle } from '../../../../lib/types/sea-battle.type';
	import { page } from '$app/stores';
	import ChevronLeft from '../../../ChevronLeft.svelte';
	import SeaBattleTargetGrid from '../../SeaBattleTargetGrid.svelte';
	import type { SeaBattleShip } from '../../../../lib/types/sea-batte-ship.type';
	import type { SeaBattleTurn } from '../../../../lib/types/sea-battle-turn.type';
	import { Navy } from '../../../../lib/enum/navy.enum';
	import { onMount } from 'svelte';
	import SeaBattleShipGrid from '../../SeaBattleShipGrid.svelte';

	let game: SeaBattle = {};
	let id = $page.params.id;

	let displayPlayerTurns = (turns: SeaBattleTurn[]) => {};
	let displayOpponentShips = (ships: SeaBattleShip[]) => {};
	let displayPlayerShips = (ships: SeaBattleShip[]) => {};
	let displayOpponentTurns = (turns: SeaBattleTurn[]) => {};

	const getSeaBattle = async () => {
		try {
			const result = await fetch(`/api/seabattle/${id}`);
			if (result.ok) {
				game = await result.json();
				if (game.ships) {
					displayPlayerShips(game.ships.filter((s) => s.Navy === Navy.Player));
					displayOpponentShips(game.ships.filter((s) => s.Navy === Navy.Opponent));
				}
				if (game.turns) {
					displayPlayerTurns(game.turns.filter((t) => t.Navy === Navy.Player));
					displayOpponentTurns(game.turns.filter((t) => t.Navy === Navy.Opponent));
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		getSeaBattle();
	});
</script>

<div class="back-link">
	<a href="/seabattle/scores">
		<ChevronLeft />
		<span>Back</span>
	</a>
</div>

<div class="mx-2 mb-2 bg-white rounded p-2">
	<div class="user">
		<strong>User</strong>
		{game.user ? game.user.UserName : 'Anonymous'}
	</div>

	<div class="status">
		<strong>Status</strong>
		{game.Status}
	</div>

	<div class="score">
		<strong>Score</strong>
		{game.Score}
	</div>

	<div class="axis">
		<strong>Axis</strong>
		{game.Axis}
	</div>
</div>

{#if game}
	<SeaBattleTargetGrid
		axis={game.Axis ?? 8}
		flag={false}
		status={game.Status}
		bind:displayTurns={displayPlayerTurns}
		bind:displayShips={displayOpponentShips}
	/>
{/if}

{#if game}
	<SeaBattleShipGrid
		axis={game.Axis ?? 8}
		flag={false}
		status={game.Status}
		bind:displayShips={displayPlayerShips}
		bind:displayTurns={displayOpponentTurns}
	/>
{/if}

<style>
	div.back-link a {
		@apply flex mb-2 h-8 font-bold;
	}
	div.back-link a span {
		@apply mt-1;
	}
</style>
