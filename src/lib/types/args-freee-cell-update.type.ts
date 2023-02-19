import type { GameStatus } from '../enum/game-status.enum';

export type ArgsFreeCellUpdate = {
	Status: GameStatus;
	Moves: number;
	Elapsed: number;
};
