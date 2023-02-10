import { connection } from '$lib/connection';
import { GameStatus } from '$lib/enum/game-status.enum';
import HangMan from '$lib/models/hang-man';
import User from '$lib/models/user';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { defaultLimit, defaultOffset } from '../../../lib/constants';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';
import Word from '../../../lib/models/word';

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
	if (Items && Items.length) {
		Word.knex(connection);
		User.knex(connection);
		for (const item of Items) {
			item.word = await Word.query().findById(item.WordId);
			item.user = item.UserId ? await User.query().findById(item.UserId) : null;
		}
	}
	return json({ Items, Count, Limit: limit, Offset: offset });
};

export const POST: RequestHandler = async ({ request }) => {
	const data: { WordId: number } = await request.json();
	if (!data || !data.WordId) throw error(400, 'Bad Request');
	HangMan.knex(connection);
	const { WordId } = data;
	const { UserId } = decodeAuthHeader(request.headers);
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
