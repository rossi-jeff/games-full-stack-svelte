import type { TenGrandOption } from './ten-grand-option.type';

export type ArgsTenGrandScore = {
	GameId: number;
	TurnId: number;
	Dice: number[];
	Options: TenGrandOption[];
};
