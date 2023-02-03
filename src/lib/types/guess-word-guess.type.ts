import type { GuessWordGuessRating } from './guess-word-guess-rating.type';

export type GuessWordGuess = {
	Id?: number;
	GuessWordId?: number;
	Guess?: string;
	CreatedAt?: string;
	UpdatedAt?: string;

	ratings?: GuessWordGuessRating[];
};
