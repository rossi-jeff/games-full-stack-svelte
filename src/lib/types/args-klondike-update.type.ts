import type { GameStatus } from '../enum/game-status.enum';

export type ArgsKlondikeUpdate = {
	Status: GameStatus;
	Moves: number;
	Elapsed: number;
};
