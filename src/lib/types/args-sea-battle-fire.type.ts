import type { Navy } from '../enum/navy.enum';

export type ArgsSeaBattleFire = {
	Id: number;
	Navy: Navy;
	Horizontal?: string;
	Vertical?: number;
};
