import type { Navy } from '$lib/enum/navy.enum';
import type { ShipType } from '$lib/enum/ship-type.enum';
import type { SeaBattleShipGridPoint } from './sea-battle-ship-grid-point.type';
import type { SeaBattleShipHit } from './sea-battle-ship-hit.type';

export type SeaBattleShip = {
	Id?: number;
	SeaBattleId?: number;
	Type?: ShipType;
	Navy?: Navy;
	Size?: number;
	Sunk?: boolean;
	CreatedAt?: string;
	UpdatedAt?: string;

	gridPoints?: SeaBattleShipGridPoint[];
	hits?: SeaBattleShipHit[];
};
