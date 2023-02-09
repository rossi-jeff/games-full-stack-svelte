import { connection } from '$lib/connection';
import { GameStatus } from '$lib/enum/game-status.enum';
import HangMan from '$lib/models/hang-man';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { defaultLimit, defaultOffset } from '../../../lib/constants';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';

export const GET: RequestHandler = async ({ url }) => {
	const Limit = url.searchParams.get('Limit');
	const Offset = url.searchParams.get('Offset');
	const limit = Limit ? parseInt(Limit) : defaultLimit;
	const offset = Offset ? parseInt(Offset) : defaultOffset;
	HangMan.knex(connection);
	const Items = await HangMan.query()
		.whereNot('Status', GameStatus.Playing)
		.orderBy('Score', 'DESC')
		.limit(limit)
		.offset(offset);
	const countResult = await HangMan.query()
		.whereNot('Status', GameStatus.Playing)
		.count('* as count');
	const Count: number = countResult[0].count ?? 0;
	return json({ Items, Count, Limit: limit, Offset: offset });
};

export const POST: RequestHandler = async ({ request }) => {
	const data: { WordId: number } = await request.json();
	if (!data || !data.WordId) throw error(400, 'Bad Request');
	HangMan.knex(connection);
	const { WordId } = data;
	const { UserId } = decodeAuthHeader(request.headers.get('Authorization'));
	const hangMan = await HangMan.query().insert({
		WordId,
		Correct: '',
		Wrong: '',
		UserId: UserId ?? undefined,
		Status: GameStatus.Playing,
		Score: 0
	});
	return json(hangMan);
};
