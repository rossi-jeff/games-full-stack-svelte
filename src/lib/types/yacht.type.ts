import type { User } from './user.type';
import type { YachtTurn } from './yacht-turn.type';

export type Yacht = {
	id?: number;
	user_id?: number;
	Total?: number;
	created_at?: Date;
	updated_at?: Date;

	turns?: YachtTurn[];
	user?: User;
};
