import type { YachtTurn } from './yacht-turn.type';

export type Yacht = {
	Id?: number;
	UserId?: number;
	Total?: number;
	CreatedAt?: string;
	UpdatedAt?: string;

	turns?: YachtTurn[];
};
