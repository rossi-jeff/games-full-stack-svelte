import type { GameStatus } from '$lib/enum/game-status.enum';
import type { User } from './user.type';
import type { Word } from './word.type';

export type HangMan = {
	Id?: number;
	WordId?: number;
	UserId?: number;
	Correct?: string;
	Wrong?: string;
	Status?: GameStatus;
	Score?: number;
	CreatedAt?: string;
	UpdatedAt?: string;

	word?: Word;
	user?: User;
};
