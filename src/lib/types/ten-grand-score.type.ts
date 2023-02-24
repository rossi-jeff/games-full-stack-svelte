import type { TenGrandCategory } from "../enum/ten-grand-category.enum";

export type TenGrandScore = {
    Id?: number;
    TenGrandTurnId?: number;
    Dice?: number;
    Category?: TenGrandCategory;
    Score?: number;
    CreatedAt?: string;
    UpdatedAt?: string;
}