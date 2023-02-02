import { json } from '@sveltejs/kit';
import CodeBreaker from '../../../lib/models/code-breaker';
import type { RequestHandler } from './$types';
import { connection } from '../../../lib/connection';
import type { ArgsCodeBreakerCreate } from '../../../lib/types/args-code-breaker-create.type';
import { error } from '@sveltejs/kit';
import { GameStatus } from '../../../lib/enum/game-status.enum';
import CodeBreakerCode from '../../../lib/models/code-breaker-code';
import { colorValue } from '../../../lib/enum/color.enum';

CodeBreaker.knex(connection);

export const GET: RequestHandler = async () => {
	const codeBreakers = await CodeBreaker.query();
	return json(codeBreakers);
};

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsCodeBreakerCreate = await request.json();
	if (!data || !data.Colors || !data.Columns) throw error(400, 'Bad Request');
	const { Colors, Columns } = data;
	const codeBreaker = await CodeBreaker.query().insert({
		Columns,
		Colors: Colors.length ?? 0,
		Status: GameStatus.Playing ?? undefined,
		Score: 0
	});
	if (Colors.length && Columns > 0 && codeBreaker) {
		const CodeBreakerId = codeBreaker.Id;
		CodeBreakerCode.knex(connection);
		for (let i = 0; i < Columns; i++) {
			const color = Colors[Math.floor(Math.random() * Colors.length)];
			await CodeBreakerCode.query().insert({
				CodeBreakerId,
				Color: colorValue[color]
			});
		}
	}
	return json(codeBreaker);
};
