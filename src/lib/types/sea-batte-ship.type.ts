import type { Navy } from '$lib/enum/navy.enum';
import type { ShipType } from '$lib/enum/ship-type.enum';
import type { SeaBattleShipGridPoint } from './sea-battle-ship-grid-point.type';
import type { SeaBattleShipHit } from './sea-battle-ship-hit.type';

export type SeaBattleShip = {
	id?: number;
	SeaBattleId?: number;
	Type?: ShipType;
	Navy?: Navy;
	Size?: number;
	Sunk?: boolean;
	created_at?: Date;
	updated_at?: Date;

	points?: SeaBattleShipGridPoint[];
	hits?: SeaBattleShipHit[];
};
