import type { CodeBreakerGuessColor } from './code-breaker-guess-color.type';
import type { CodeBreakerGuessKey } from './code-breaker-guess-key.type';

export type CodeBreakerGuess = {
	Id?: number;
	CodeBreakerId?: number;
	CreatedAt?: Date;
	UpdatedAt?: Date;

	colors?: CodeBreakerGuessColor[];
	keys?: CodeBreakerGuessKey[];
};
