import type { Color } from '../enum/color.enum';

export type CodeBreakerGuessColor = {
	Id?: number;
	CodeBreakerGuessId?: number;
	Color?: Color;
	CreatedAt?: Date;
	UpdatedAt?: Date;
};
