import { GameStatus } from './enum/game-status.enum';

export const codeBreakerStatus = (black: number, columns: number, guesses: number) => {
	if (black === columns) return GameStatus.Won;
	if (guesses >= columns * 2) return GameStatus.Lost;
	return GameStatus.Playing;
};
