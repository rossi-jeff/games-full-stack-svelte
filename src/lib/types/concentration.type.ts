import type { GameStatus } from "../enum/game-status.enum";
import type { User } from './user.type'

export type Concentration = {
    Id?: number;
    UserId?: number;
    Status?: GameStatus;
    Moves?: number;
    Matched?: number;
    Elapsed?: number;
    CreatedAt?: Date;
    UpdatedAt?: Date;

    user?: User;
}