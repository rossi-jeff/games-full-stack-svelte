import type { TenGrandCategory } from "../enum/ten-grand-category.enum";

export type TenGrandScore = {
	id?: number;
	TenGrandTurnId?: number;
	Dice?: string;
	Category?: TenGrandCategory;
	Score?: number;
	created_at?: Date;
	updated_at?: Date;
};