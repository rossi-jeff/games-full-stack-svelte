import type { Navy } from '$lib/enum/navy.enum';
import type { ShipType } from '$lib/enum/ship-type.enum';

export type ArgsGridPoint = {
	Horizontal: string;
	Vertical: number;
};

export type ArgsSeaBattleShip = {
	Id: number;
	Navy: Navy;
	ShipType: ShipType;
	Size: number;
	Points?: ArgsGridPoint[];
};
