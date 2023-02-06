import type { Navy } from '$lib/enum/navy.enum';
import type { ShipType } from '$lib/enum/ship-type.enum';
import type { Target } from '$lib/enum/target.enum';
import type { SeaBattleTurnGridPoint } from './sea-battle-turn-grid-point.type';

export type SeaBattleTurn = {
	Id?: number;
	SeaBattleId?: number;
	ShipType?: ShipType;
	Navy?: Navy;
	Target?: Target;
	CreatedAt?: string;
	UpdatedAt?: string;

	gridPoint?: SeaBattleTurnGridPoint;
};
