import type { Navy } from '$lib/enum/navy.enum';
import type { ShipType } from '$lib/enum/ship-type.enum';
import type { Target } from '$lib/enum/target.enum';

export type SeaBattleTurn = {
	id?: number;
	SeaBattleId?: number;
	ShipType?: ShipType;
	Navy?: Navy;
	Target?: Target;
	Horizontal?: string;
	Vertical?: number;
	created_at?: Date;
	updated_at?: Date;
};
