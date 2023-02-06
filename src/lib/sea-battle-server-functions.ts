import { connection } from './connection';
import { Navy } from './enum/navy.enum';
import { ShipDirections, ShipType } from './enum/ship-type.enum';
import SeaBattle from './models/sea-battle';
import SeaBattleShip from './models/sea-battle-ship';
import SeaBattleShipGridPoint from './models/sea-battle-ship-grid-point';
import { MaxAxis } from './sea-battle-functions';
import type { ArgsGridPoint } from './types/args-sea-battle-ship';

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
