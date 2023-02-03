import { GameStatus } from './enum/game-status.enum';

export const guessWordStatus = (green: number, length: number, guesses: number) => {
	if (green === length) return GameStatus.Won;
	if (guesses > Math.ceil((length * 3) / 2)) return GameStatus.Lost;
	return GameStatus.Playing;
};
