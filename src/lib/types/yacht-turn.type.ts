import type { YachtCategory } from '$lib/enum/yacht-category.enum';

export type YachtTurn = {
	Id?: number;
	YachtId?: number;
	RollOne?: string;
	RollTwo?: string;
	RollThree?: string;
	Category?: YachtCategory;
	Score?: number;
	CreatedAt?: string;
	UpdatedAt?: string;
};
