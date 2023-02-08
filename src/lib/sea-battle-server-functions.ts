import { connection } from './connection';
import { Navy } from './enum/navy.enum';
import { ShipDirections, ShipType } from './enum/ship-type.enum';
import { Target } from './enum/target.enum';
import SeaBattle from './models/sea-battle';
import SeaBattleShip from './models/sea-battle-ship';
import SeaBattleShipGridPoint from './models/sea-battle-ship-grid-point';
import { MaxAxis } from './sea-battle-functions';
import type { ArgsGridPoint } from './types/args-sea-battle-ship';
import SeaBattleShipHit from './models/sea-battle-ship-hit';
import SeaBattleTurn from './models/sea-battle-turn';
import SeaBattleTurnGridPoint from './models/sea-battle-turn-grid-point';
import { GameStatus } from './enum/game-status.enum';
import type { FlagType } from './types/flag.type';

export const seaBattlePlayerShip = async (
	SeaBattleId: number,
	ShipType: ShipType,
	Size: number,
	points?: ArgsGridPoint[]
) => {
	SeaBattleShip.knex(connection);
	const ship = await SeaBattleShip.query().insert({
		SeaBattleId,
		Type: ShipType,
		Size,
		Navy: Navy.Player
	});
	if (ship) {
		const SeaBattleShipId = ship.Id;
		ship.gridPoints = [];
		if (points) {
			SeaBattleShipGridPoint.knex(connection);
			for (const point of points) {
				const { Horizontal, Vertical } = point;
				const gridPoint = await SeaBattleShipGridPoint.query().insert({
					SeaBattleShipId,
					Horizontal,
					Vertical
				});
				if (gridPoint) ship.gridPoints.push(gridPoint);
			}
		}
	}
	return ship;
};

export const seaBattleOpponentShip = async (
	SeaBattleId: number,
	ShipType: ShipType,
	Size: number
) => {
	SeaBattleShip.knex(connection);
	const ship = await SeaBattleShip.query().insert({
		SeaBattleId,
		Type: ShipType,
		Size,
		Navy: Navy.Opponent
	});
	if (ship) {
		ship.gridPoints = [];
		SeaBattleShipGridPoint.knex(connection);
		const points = await availableGridPoints(SeaBattleId, Size);
		if (points.length) {
			for (const point of points) {
				const gridPoint = await SeaBattleShipGridPoint.query().insert({
					SeaBattleShipId: ship.Id,
					Horizontal: point.Horizontal,
					Vertical: point.Vertical
				});
				if (gridPoint) ship.gridPoints.push(gridPoint);
			}
		}
	}
	return ship;
};

export const availableGridPoints = async (SeaBattleId: number, Size: number) => {
	SeaBattle.knex(connection);
	SeaBattleShip.knex(connection);
	const seaBattle = await SeaBattle.query().findById(SeaBattleId).select('Axis');
	if (!seaBattle) return [];

	const horizontalAxis = MaxAxis.H.slice(0, seaBattle.Axis);
	const verticalAxis = MaxAxis.V.slice(0, seaBattle.Axis);
	const occupied: ArgsGridPoint[] = [];

	const ships = await SeaBattleShip.query()
		.where('SeaBattleId', SeaBattleId)
		.where('Navy', Navy.Opponent);
	if (ships.length) {
		SeaBattleShipGridPoint.knex(connection);
		for (const ship of ships) {
			const gridPoints = await SeaBattleShipGridPoint.query().where('SeaBattleShipId', ship.Id);
			if (gridPoints.length) {
				for (const point of gridPoints) {
					const { Horizontal, Vertical } = point;
					if (Horizontal && Vertical) occupied.push({ Horizontal, Vertical });
				}
			}
		}
	}

	let idxH: number, idxV: number, direction: string, idxO: number, H: string, V: number;
	let points: ArgsGridPoint[] = [];

	while (points.length < Size) {
		points = [];
		idxH = Math.floor(Math.random() * horizontalAxis.length);
		idxV = Math.floor(Math.random() * verticalAxis.length);
		direction = ShipDirections[Math.floor(Math.random() * ShipDirections.length)];
		for (let s = 0; s < Size; s++) {
			H = horizontalAxis[idxH];
			V = verticalAxis[idxV];
			if (!H || !V) break;
			idxO = occupied.findIndex((o) => o.Horizontal === H && o.Vertical === V);
			if (idxO != -1) break;
			points.push({ Horizontal: H, Vertical: V });
			switch (direction) {
				case 'right':
					idxH++;
					break;
				case 'down':
					idxV++;
					break;
				case 'left':
					idxH--;
					break;
				case 'up':
					idxV--;
					break;
			}
		}
	}

	return points;
};

export const seaBattlePlayerFire = async (Id: number, Horizontal?: string, Vertical?: number) => {
	if (!Horizontal || !Vertical) return null;
	return await createSeaBattleTurn(Id, Navy.Player, Horizontal, Vertical);
};

export const seaBattleOpponentFire = async (Id: number) => {
	SeaBattleTurn.knex(connection);
	SeaBattle.knex(connection);

	const seaBattle = await SeaBattle.query().findById(Id).select('Axis');
	if (!seaBattle) return null;

	const horizontalAxis = MaxAxis.H.slice(0, seaBattle.Axis);
	const verticalAxis = MaxAxis.V.slice(0, seaBattle.Axis);

	const available: ArgsGridPoint[] = [];
	for (const Horizontal of horizontalAxis) {
		for (const Vertical of verticalAxis) {
			available.push({ Horizontal, Vertical });
		}
	}
	const turns = await SeaBattleTurn.query().where('SeaBattleId', Id).where('Navy', Navy.Opponent);
	if (turns.length) {
		SeaBattleTurnGridPoint.knex(connection);
		for (const turn of turns) {
			const gridPoint = await SeaBattleTurnGridPoint.query().where('SeaBattleTurnId', turn.Id);
			if (gridPoint.length) {
				const { Horizontal, Vertical } = gridPoint[0];
				const idx = available.findIndex(
					(p) => p.Horizontal === Horizontal && p.Vertical === Vertical
				);
				if (idx != -1) available.splice(idx, 1);
			}
		}
	}
	const point = available[Math.floor(Math.random() * available.length)];
	const { Horizontal, Vertical } = point;
	return await createSeaBattleTurn(Id, Navy.Opponent, Horizontal, Vertical);
};

export const createSeaBattleTurn = async (
	Id: number,
	navy: Navy,
	Horizontal: string,
	Vertical: number
) => {
	SeaBattleShip.knex(connection);
	SeaBattleTurn.knex(connection);
	const ships = await SeaBattleShip.query().where('SeaBattleId', Id).whereNot('Navy', navy);
	let target = Target.Miss;
	let shipType: ShipType | undefined = undefined;
	let shipId: number | undefined = undefined;
	let shipSize: number | undefined = undefined;
	if (ships.length) {
		SeaBattleShipGridPoint.knex(connection);
		SeaBattleShipHit.knex(connection);
		for (const ship of ships) {
			const points = await SeaBattleShipGridPoint.query().where('SeaBattleShipId', ship.Id);
			if (points.length) {
				for (const point of points) {
					if (point.Horizontal === Horizontal && point.Vertical === Vertical) {
						target = Target.Hit;
						shipType = ship.Type;
						shipId = ship.Id;
						shipSize = ship.Size;
					}
				}
			}
		}
		if (shipId) {
			const hits = await SeaBattleShipHit.query().where('SeaBattleShipId', shipId);
			if (hits.length + 1 === shipSize) {
				target = Target.Sunk;
				await SeaBattleShip.query().findById(shipId).patch({ Sunk: true });
			}
			await SeaBattleShipHit.query().insert({
				SeaBattleShipId: shipId,
				Horizontal,
				Vertical
			});
		}
	}
	const turn = await SeaBattleTurn.query().insert({
		SeaBattleId: Id,
		Navy: navy,
		Target: target,
		ShipType: shipType
	});
	if (turn) {
		SeaBattleTurnGridPoint.knex(connection);
		turn.gridPoint = await SeaBattleTurnGridPoint.query().insert({
			SeaBattleTurnId: turn.Id,
			Horizontal,
			Vertical
		});
	}
	return turn;
};

export const seaBattleStatus = async (Id: number) => {
	SeaBattleShip.knex(connection);
	const ships = await SeaBattleShip.query().where('SeaBattleId', Id);
	const allSunk: FlagType = {
		player: true,
		opponent: true
	};
	if (ships.length) {
		for (const ship of ships) {
			if (!ship.Sunk) {
				ship.Navy === Navy.Player ? (allSunk.player = false) : (allSunk.opponent = false);
			}
		}
	} else {
		return GameStatus.Playing;
	}
	if (allSunk.player) return GameStatus.Lost;
	if (allSunk.opponent) return GameStatus.Won;
	return GameStatus.Playing;
};

export const seaBattleScore = async (Id: number, Status: GameStatus) => {
	SeaBattle.knex(connection);
	SeaBattleTurn.knex(connection);
	const seaBattle = await SeaBattle.query().findById(Id).select('Axis');
	if (!seaBattle || !seaBattle.Axis) return 0;
	const maxTurns = seaBattle.Axis * seaBattle.Axis * 2;
	const perMiss = 5;
	const perHit = 10;
	let Score = Status === GameStatus.Won ? maxTurns * perMiss : 0;
	const turns = await SeaBattleTurn.query().where('SeaBattleId', Id);
	if (turns && turns.length) {
		Score -= turns.length * perMiss;
		for (const turn of turns) {
			if (turn.Navy === Navy.Player) {
				if (turn.Target === Target.Hit) Score += perHit;
				if (turn.Target === Target.Miss) Score -= perMiss;
				if (turn.Target === Target.Sunk) Score += perHit * 2;
			} else {
				if (turn.Target === Target.Hit) Score -= perHit;
				if (turn.Target === Target.Miss) Score += perMiss;
				if (turn.Target === Target.Sunk) Score -= perHit * 2;
			}
		}
	}
	return Score;
};
