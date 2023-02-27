import type { TenGrandScore } from "./ten-grand-score.type";

export type TenGrandTurn = {
    Id?: number;
    TenGrandId?: number;
    Score?: number;
    CreatedAt?: string;
    UpdatedAt?: string;

    scores?: TenGrandScore[];
}