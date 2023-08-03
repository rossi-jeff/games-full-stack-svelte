<script lang="ts">
	import { clone } from '$lib/clone';
	import { Navy } from '$lib/enum/navy.enum';
	import type { ShipType } from '$lib/enum/ship-type.enum';
	import type { ArgsSeaBattleShip } from '$lib/types/args-sea-battle-ship';
	import type { FlagType } from '$lib/types/flag.type';
	import type { SeaBattleShip } from '$lib/types/sea-batte-ship.type';
	import type { SeaBattle } from '$lib/types/sea-battle.type';
	import { userSession, type UserSessionData } from '$lib/user-session.writable';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { buildRequestHeaders } from '../../lib/build-request-headers';
	import { railsRoot } from '../../lib/constants';
	import type { ArgsSeaBattleFire } from '../../lib/types/args-sea-battle-fire.type';
	import type { SeaBattleTurn } from '../../lib/types/sea-battle-turn.type';
	import InProgressSeaBattles from './InProgressSeaBattles.svelte';
	import SeaBattleDirections from './SeaBattleDirections.svelte';
	import SeaBattleGameOptions from './SeaBattleGameOptions.svelte';
	import SeaBattlePlacementGrid from './SeaBattlePlacementGrid.svelte';
	import SeaBattleShipGrid from './SeaBattleShipGrid.svelte';
	import SeaBattleTargetGrid from './SeaBattleTargetGrid.svelte';

	let game: SeaBattle = {};
	let inProgress: SeaBattle[] = [];
	let shipsToPlace: string[] = [];
	let flags: FlagType = {
		newGame: false,
		playerFire: false,
		opponentFire: false
	};
	let modes = Object.values(Navy);
	let modeIdx = modes.indexOf(Navy.Player);
	let mode = modes[modeIdx];
	const session: UserSessionData = get(userSession);

	const newGame = async (event: any) => {
		const { Axis, ships } = event.detail;
		shipsToPlace = [];
		flags.newGame = true;
		for (const ship in ships) {
			for (let i = 0; i < ships[ship]; i++) shipsToPlace.push(ship);
		}
		try {
			const result = await fetch(`${railsRoot}/api/sea_battle`, {
				method: 'POST',
				body: JSON.stringify({ Axis }),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				game = await result.json();
				console.log(game);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const reloadGame = async () => {
		if (!game.id) return;
		try {
			const result = await fetch(`${railsRoot}/api/sea_battle/${game.id}`);
			if (result.ok) {
				game = await result.json();
				console.log(game);
				setTimeout(() => {
					if (game.ships) {
						displayPlayerShips(game.ships.filter((s) => s.Navy && s.Navy.toString() == 'Player'));
						displayOpponentShips(
							game.ships.filter((s) => s.Navy && s.Navy.toString() == 'Opponent')
						);
					}
					if (game.turns) {
						displayPlayerTurns(game.turns.filter((t) => t.Navy && t.Navy.toString() == 'Player'));
						displayOpponentTurns(
							game.turns.filter((t) => t.Navy && t.Navy.toString() == 'Opponent')
						);
					}
				}, 100);
			}
		} catch (error) {
			console.log(error);
		}
	};

	let displayPlayerShips = (ships: SeaBattleShip[]) => {};

	let displayOpponentShips = (ships: SeaBattleShip[]) => {};

	let displayPlayerTurns = (turns: SeaBattleTurn[]) => {};

	let displayOpponentTurns = (turns: SeaBattleTurn[]) => {};

	const createShip = (event: any) => {
		const { shipType, size, points } = event.detail;
		createPlayerShip(shipType, size, points);
		createOpponentShip(shipType, size);
	};

	const removeShipToPlace = (shipType: ShipType) => {
		const idx = shipsToPlace.indexOf(shipType);
		if (idx != -1) {
			shipsToPlace.splice(idx, 1);
			shipsToPlace = clone(shipsToPlace);
		}
		resetPlacement();
	};

	let resetPlacement = () => {};

	type pointType = { h: string; v: number };

	const createPlayerShip = async (shipType: ShipType, size: number, points: pointType[]) => {
		if (!game.id) return;
		const payload: ArgsSeaBattleShip = {
			ShipType: shipType,
			Size: size,
			Navy: Navy.Player
		};
		payload.Points = [];
		for (const point of points) {
			payload.Points.push({ Horizontal: point.h, Vertical: point.v });
		}
		try {
			const result = await fetch(`${railsRoot}/api/sea_battle/${game.id}/ship`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				const ship = await result.json();
				console.log(ship);
				reloadGame();
				removeShipToPlace(shipType);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const createOpponentShip = async (shipType: ShipType, size: number) => {
		if (!game.id) return;
		const payload: ArgsSeaBattleShip = {
			ShipType: shipType,
			Size: size,
			Navy: Navy.Opponent
		};
		try {
			const result = await fetch(`${railsRoot}/api/sea_battle/${game.id}/ship`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				const ship = await result.json();
				console.log(ship);
				reloadGame();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const toggleMode = () => {
		modeIdx++;
		if (modeIdx >= modes.length) modeIdx = 0;
		mode = modes[modeIdx];
		if (mode === Navy.Opponent) {
			flags.opponentFire = false;
			setTimeout(() => {
				if (game && game.ships)
					displayPlayerShips(game.ships.filter((s) => s.Navy && s.Navy.toString() == 'Player'));
				if (game && game.turns)
					displayOpponentTurns(game.turns.filter((t) => t.Navy && t.Navy.toString() == 'Opponent'));
			}, 100);
		} else {
			flags.playerFire = false;
			setTimeout(() => {
				if (game && game.turns)
					displayPlayerTurns(game.turns.filter((t) => t.Navy && t.Navy.toString() == 'Player'));
				if (game && game.ships)
					displayOpponentShips(game.ships.filter((s) => s.Navy && s.Navy.toString() == 'Opponent'));
			}, 100);
		}
	};

	const playerTurn = async (event: any) => {
		if (!game.id) return;
		const { Horizontal, Vertical } = event.detail;
		const payload: ArgsSeaBattleFire = {
			Navy: Navy.Player,
			Horizontal,
			Vertical
		};
		try {
			const result = await fetch(`${railsRoot}/api/sea_battle/${game.id}/fire`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				const turn = await result.json();
				flags.playerFire = true;
				console.log(turn);
				reloadGame();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const opponentTurn = async () => {
		if (!game.id) return;
		const payload: ArgsSeaBattleFire = {
			Navy: Navy.Opponent
		};
		try {
			const result = await fetch(`${railsRoot}/api/sea_battle/${game.id}/fire`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				const turn = await result.json();
				flags.opponentFire = true;
				console.log(turn);
				reloadGame();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const loadInProgress = async () => {
		if (!session.Token) return;
		try {
			const result = await fetch(`${railsRoot}/api/sea_battle/progress`, {
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
		modeIdx = modes.indexOf(Navy.Player);
		mode = modes[modeIdx];
		reloadGame();
	};

	onMount(() => {
		loadInProgress();
	});
</script>

<svelte:head>
	<title>Sea Battle Game</title>
</svelte:head>

<h2>Sea Battle</h2>

{#if game && game.Status === 'Playing'}
	{#if shipsToPlace.length > 0}
		<SeaBattlePlacementGrid
			{shipsToPlace}
			axis={game.Axis ?? 8}
			on:placeShip={createShip}
			bind:reset={resetPlacement}
			bind:displayShips={displayPlayerShips}
		/>
	{:else if mode === Navy.Player}
		<SeaBattleTargetGrid
			axis={game.Axis ?? 8}
			flag={flags.playerFire}
			status={game.Status}
			on:nextTurn={toggleMode}
			on:fire={playerTurn}
			bind:displayTurns={displayPlayerTurns}
			bind:displayShips={displayOpponentShips}
		/>
	{:else}
		<SeaBattleShipGrid
			axis={game.Axis ?? 8}
			flag={flags.opponentFire}
			status={game.Status}
			on:nextTurn={toggleMode}
			on:fire={opponentTurn}
			bind:displayShips={displayPlayerShips}
			bind:displayTurns={displayOpponentTurns}
		/>
	{/if}
{:else}
	<SeaBattleGameOptions on:newGame={newGame} flag={flags.newGame} />
{/if}

{#if inProgress && inProgress.length && game && game.Status !== 'Playing'}
	<InProgressSeaBattles {inProgress} on:continueGame={continueGame} />
{/if}

{#if game && game.Status !== 'Playing'}
	<div class="scores-link">
		<a href="/seabattle/scores">See Top Scores</a>
	</div>

	<SeaBattleDirections />
{/if}

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
	div.scores-link {
		@apply mx-2 mt-4;
	}
</style>
