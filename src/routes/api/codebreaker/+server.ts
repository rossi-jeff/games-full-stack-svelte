import { json } from '@sveltejs/kit';
import CodeBreaker from '../../../lib/models/code-breaker';
import type { RequestHandler } from './$types';
import { connection } from '../../../lib/connection';
import type { ArgsCodeBreakerCreate } from '../../../lib/types/args-code-breaker-create.type';
import { error } from '@sveltejs/kit';
import { GameStatus } from '../../../lib/enum/game-status.enum';
import CodeBreakerCode from '../../../lib/models/code-breaker-code';
import { colorValue } from '../../../lib/enum/color.enum';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';
import { defaultLimit, defaultOffset } from '../../../lib/constants';
import User from '$lib/models/user';

CodeBreaker.knex(connection);

export const GET: RequestHandler = async ({ url }) => {
	const Limit = url.searchParams.get('Limit');
	const Offset = url.searchParams.get('Offset');
	const limit = Limit ? parseInt(Limit) : defaultLimit;
	const offset = Offset ? parseInt(Offset) : defaultOffset;
	const Items = await CodeBreaker.query()
		.whereNot('Status', GameStatus.Playing)
		.orderBy('Score', 'DESC')
		.limit(limit)
		.offset(offset);
	const countResult = await CodeBreaker.query()
		.whereNot('Status', GameStatus.Playing)
		.count('* as count');
	const Count: number = countResult[0].count ?? 0;
	if (Items && Items.length) {
		User.knex(connection);
		for (const item of Items) {
			item.user = item.UserId ? await User.query().findById(item.UserId) : null;
		}
	}
	return json({ Items, Count, Limit: limit, Offset: offset });
};

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsCodeBreakerCreate = await request.json();
	if (!data || !data.Colors || !data.Columns) throw error(400, 'Bad Request');
	const { Colors, Columns } = data;
	const { UserId } = decodeAuthHeader(request.headers);
	const codeBreaker = await CodeBreaker.query().insert({
		Columns,
		Colors: Colors.length ?? 0,
		Status: GameStatus.Playing ?? undefined,
		UserId: UserId ?? undefined,
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
