import { connection } from '$lib/connection';
import SeaBattle from '$lib/models/sea-battle';
import User from '$lib/models/user';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { defaultLimit, defaultOffset } from '../../../lib/constants';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';
import { GameStatus } from '../../../lib/enum/game-status.enum';

export const GET: RequestHandler = async ({ url }) => {
	const Limit = url.searchParams.get('Limit');
	const Offset = url.searchParams.get('Offset');
	const limit = Limit ? parseInt(Limit) : defaultLimit;
	const offset = Offset ? parseInt(Offset) : defaultOffset;
	SeaBattle.knex(connection);
	const Items = await SeaBattle.query()
		.whereNot('Status', GameStatus.Playing)
		.orderBy('Score', 'DESC')
		.limit(limit)
		.offset(offset);
	const countResult = await SeaBattle.query()
		.whereNot('Status', GameStatus.Playing)
		.count('* as count');
	const Count: number = countResult[0].count ?? 0;
	if (Items && Items.length) {
		User.knex(connection)
		for (const item of Items) {
			item.user = item.UserId ? await User.query().findById(item.UserId) : null;
		}
	}
	return json({ Items, Count, Limit: limit, Offset: offset });
};

export const POST: RequestHandler = async ({ request }) => {
	const data: { Axis: number } = await request.json();
	if (!data || !data.Axis) throw error(400, 'Bad Request');
	const { Axis } = data;
	const { UserId } = decodeAuthHeader(request.headers);
	SeaBattle.knex(connection);
	const seaBattle = await SeaBattle.query().insert({
		Axis,
		UserId: UserId ?? undefined
	});
	return json(seaBattle);
};
