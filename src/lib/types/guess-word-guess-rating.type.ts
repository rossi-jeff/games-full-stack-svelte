import type { Rating } from '../enum/rating.enum';

export type GuessWordGuessRating = {
	Id?: number;
	GuessWordGuessId?: number;
	Rating?: Rating;
	CreatedAt?: string;
	UpdatedAt?: string;
};
