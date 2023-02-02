import type { Color } from '../enum/color.enum';

export type CodeBreakerCode = {
	Id?: number;
	CodeBreakerId?: number;
	Color?: Color;
	CreatedAt?: Date;
	UpdatedAt?: Date;
};
