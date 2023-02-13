import type { GameStatus } from '../enum/game-status.enum';
import type { CodeBreakerCode } from './code-breaker-code.type';
import type { CodeBreakerGuess } from './code-breaker-guess.type';
import type { User } from './user.type';

export type CodeBreaker = {
	Id?: number;
	UserId?: number;
	Status?: GameStatus;
	Columns?: number;
	Colors?: number;
	Score?: number;
	CreatedAt?: Date;
	UpdatedAt?: Date;

	codes?: CodeBreakerCode[];
	guesses?: CodeBreakerGuess[];
	user?: User;
};
