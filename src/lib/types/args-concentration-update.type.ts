import type { GameStatus } from '../enum/game-status.enum';

export type ArgsConcentrationUpdate = {
	Status: GameStatus;
	Moves: number;
	Elapsed: number;
	Matched: number;
};
