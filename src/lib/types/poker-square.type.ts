import type { GameStatus } from '$lib/enum/game-status.enum';
import type { User } from './user.type';

export type PokerSquare = {
	id?: number;
	user_id?: number;
	Status?: GameStatus;
	Score?: number;
	created_at?: Date;
	updated_at?: Date;

	user?: User;
};
