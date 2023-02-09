import GuessWord from '../../../lib/models/guess-word';
import type { RequestHandler } from './$types';
import { connection } from '../../../lib/connection';
import { error, json } from '@sveltejs/kit';
import { GameStatus } from '../../../lib/enum/game-status.enum';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';
import { defaultLimit, defaultOffset } from '../../../lib/constants';

export const GET: RequestHandler = async ({ url }) => {
	const Limit = url.searchParams.get('Limit');
	const Offset = url.searchParams.get('Offset');
	const limit = Limit ? parseInt(Limit) : defaultLimit;
	const offset = Offset ? parseInt(Offset) : defaultOffset;
	GuessWord.knex(connection);
	const Items = await GuessWord.query()
		.whereNot('Status', GameStatus.Playing)
		.orderBy('Score', 'DESC')
		.limit(limit)
		.offset(offset);
	const countResult = await GuessWord.query()
		.whereNot('Status', GameStatus.Playing)
		.count('* as count');
	const Count: number = countResult[0].count ?? 0;
	return json({ Items, Count, Limit: limit, Offset: offset });
};

export const POST: RequestHandler = async ({ request }) => {
	GuessWord.knex(connection);
	const data: { WordId: number } = await request.json();
	if (!data || !data.WordId) throw error(400, 'Bad Request');
	const { WordId } = data;
	const { UserId } = decodeAuthHeader(request.headers.get('Authorization'));
	const guessWord = await GuessWord.query().insert({
		WordId,
		UserId: UserId ?? undefined,
		Status: GameStatus.Playing,
		Score: 0
	});
	return json(guessWord);
};
