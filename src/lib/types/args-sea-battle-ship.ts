import type { Navy } from '$lib/enum/navy.enum';
import type { ShipType } from '$lib/enum/ship-type.enum';

export type ArgsGridPoint = {
	Horizontal: string;
	Vertical: number;
};

export type ArgsSeaBattleShip = {
	Navy: Navy;
	ShipType: ShipType;
	Size: number;
	Points?: ArgsGridPoint[];
};
