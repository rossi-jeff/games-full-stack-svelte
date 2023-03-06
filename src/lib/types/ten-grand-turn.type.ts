import type { TenGrandScore } from "./ten-grand-score.type";

export type TenGrandTurn = {
	id?: number;
	TenGrandId?: number;
	Score?: number;
	created_at?: Date;
	updated_at?: Date;

	scores?: TenGrandScore[];
};