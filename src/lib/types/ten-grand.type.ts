import type { GameStatus } from '../enum/game-status.enum';
import type { TenGrandTurn } from './ten-grand-turn.type';
import type { User } from './user.type';

export type TenGrand = {
    Id?: number;
    UserId?: number;
    Status?: GameStatus;
    Score?: number;
    CreatedAt?: string;
    UpdatedAt?: string;

    user?: User;
    turns?: TenGrandTurn[];
}