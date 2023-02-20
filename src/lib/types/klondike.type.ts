import type { GameStatus } from "../enum/game-status.enum";
import type { User } from './user.type'

export type Klondike = {
    Id?: number;
    UserId?: number;
    Status?: GameStatus;
    Moves?: number;
    Elapsed?: number;
    CreatedAt?: Date;
    UpdatedAt?: Date;

    user?: User;
}