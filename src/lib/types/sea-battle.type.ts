import type { GameStatus } from '$lib/enum/game-status.enum';
import type { SeaBattleShip } from './sea-batte-ship.type';
import type { SeaBattleTurn } from './sea-battle-turn.type';

export type SeaBattle = {
	Id?: number;
	Axis?: number;
	UserId?: number;
	Status?: GameStatus;
	Score?: number;
	CreatedAt?: string;
	UpdatedAt?: string;

	ships?: SeaBattleShip[];
	turns?: SeaBattleTurn[];
};
