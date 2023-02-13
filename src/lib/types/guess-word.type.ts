import type { GameStatus } from '../enum/game-status.enum';
import type { GuessWordGuess } from './guess-word-guess.type';
import type { User } from './user.type';
import type { Word } from './word.type';

export type GuessWord = {
	Id?: number;
	WordId?: number;
	UserId?: number;
	Status?: GameStatus;
	Score?: number;
	CreatedAt?: string;
	UpdatedAt?: string;

	word?: Word;
	guesses?: GuessWordGuess[];
	user?: User;
};
