<script lang="ts">
	import { clone } from '$lib/clone';
	import { Navy } from '$lib/enum/navy.enum';
	import type { ShipType } from '$lib/enum/ship-type.enum';
	import type { ArgsSeaBattleShip } from '$lib/types/args-sea-battle-ship';
	import type { FlagType } from '$lib/types/flag.type';
	import type { SeaBattleShip } from '$lib/types/sea-batte-ship.type';
	import type { SeaBattle } from '$lib/types/sea-battle.type';
	import type { ArgsSeaBattleFire } from '../../lib/types/args-sea-battle-fire.type';
	import type { SeaBattleTurn } from '../../lib/types/sea-battle-turn.type';
	import SeaBattleGameOptions from './SeaBattleGameOptions.svelte';
	import SeaBattlePlacementGrid from './SeaBattlePlacementGrid.svelte';
	import SeaBattleShipGrid from './SeaBattleShipGrid.svelte';
	import SeaBattleTargetGrid from './SeaBattleTargetGrid.svelte';

	let game: SeaBattle = {};
	let shipsToPlace: string[] = [];
	let flags: FlagType = {
		newGame: false,
		playerFire: false,
		opponentFire: false
	};
	let modes = Object.values(Navy);
	let modeIdx = modes.indexOf(Navy.Player);
	let mode = modes[modeIdx];

	const newGame = async (event: any) => {
		const { Axis, ships } = event.detail;
		shipsToPlace = [];
		flags.newGame = true;
		for (const ship in ships) {
			for (let i = 0; i < ships[ship]; i++) shipsToPlace.push(ship);
		}
		try {
			const result = await fetch('/api/seabattle', {
				method: 'POST',
				body: JSON.stringify({ Axis })
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
			const result = await fetch(`/api/seabattle/${game.Id}`);
			if (result.ok) {
				game = await result.json();
				console.log(game);
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
		if (!game.Id) return;
		const payload: ArgsSeaBattleShip = {
			Id: game.Id,
			ShipType: shipType,
			Size: size,
			Navy: Navy.Player
		};
		payload.Points = [];
		for (const point of points) {
			payload.Points.push({ Horizontal: point.h, Vertical: point.v });
		}
		try {
			const result = await fetch('/api/seabattle/ship', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			if (result.ok) {
				await result.json();
				reloadGame();
				removeShipToPlace(shipType);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const createOpponentShip = async (shipType: ShipType, size: number) => {
		if (!game.Id) return;
		const payload: ArgsSeaBattleShip = {
			Id: game.Id,
			ShipType: shipType,
			Size: size,
			Navy: Navy.Opponent
		};
		try {
			const result = await fetch('/api/seabattle/ship', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			if (result.ok) {
				await result.json();
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
					displayPlayerShips(game.ships.filter((s) => s.Navy === Navy.Player));
				if (game && game.turns)
					displayOpponentTurns(game.turns.filter((t) => t.Navy === Navy.Opponent));
			}, 100);
		} else {
			flags.playerFire = false;
			setTimeout(() => {
				if (game && game.turns)
					displayPlayerTurns(game.turns.filter((t) => t.Navy === Navy.Player));
				if (game && game.ships)
					displayOpponentShips(game.ships.filter((s) => s.Navy === Navy.Opponent));
			}, 100);
		}
	};

	const playerTurn = async (event: any) => {
		if (!game.Id) return;
		const { Horizontal, Vertical } = event.detail;
		const payload: ArgsSeaBattleFire = {
			Id: game.Id,
			Navy: Navy.Player,
			Horizontal,
			Vertical
		};
		try {
			const result = await fetch('/api/seabattle/fire', {
				method: 'POST',
				body: JSON.stringify(payload)
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

	const opponentTurn = async (e) => {
		if (!game.Id) return;
		const payload: ArgsSeaBattleFire = {
			Id: game.Id,
			Navy: Navy.Opponent
		};
		try {
			const result = await fetch('/api/seabattle/fire', {
				method: 'POST',
				body: JSON.stringify(payload)
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
</script>

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
			on:nextTurn={toggleMode}
			on:fire={playerTurn}
			bind:displayTurns={displayPlayerTurns}
			bind:displayShips={displayOpponentShips}
		/>
	{:else}
		<SeaBattleShipGrid
			axis={game.Axis ?? 8}
			flag={flags.opponentFire}
			on:nextTurn={toggleMode}
			on:fire={opponentTurn}
			bind:displayShips={displayPlayerShips}
			bind:displayTurns={displayOpponentTurns}
		/>
	{/if}
{:else}
	<SeaBattleGameOptions on:newGame={newGame} flag={flags.newGame} />
{/if}

<style>
	h2 {
		@apply font-bold text-lg mb-2 mx-2;
	}
</style>
