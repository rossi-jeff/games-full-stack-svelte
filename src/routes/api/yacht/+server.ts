import { connection } from '$lib/connection';
import Yacht from '$lib/models/yacht';
import { json, type RequestHandler } from '@sveltejs/kit';
import { defaultLimit, defaultOffset } from '../../../lib/constants';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';

export const GET: RequestHandler = async ({ url }) => {
	const Limit = url.searchParams.get('Limit');
	const Offset = url.searchParams.get('Offset');
	const limit = Limit ? parseInt(Limit) : defaultLimit;
	const offset = Offset ? parseInt(Offset) : defaultOffset;
	Yacht.knex(connection);
	const Items = await Yacht.query()
		.whereNot('Total', 0)
		.orderBy('Total', 'DESC')
		.limit(limit)
		.offset(offset);
	const countResult = await Yacht.query().whereNot('Total', 0).count('* as count');
	const Count: number = countResult[0].count ?? 0;
	return json({ Items, Count, Limit: limit, Offset: offset });
};

export const POST: RequestHandler = async ({ request }) => {
	Yacht.knex(connection);
	const { UserId } = decodeAuthHeader(request.headers.get('Authorization'));
	const yacht = await Yacht.query().insert({ UserId: UserId ?? undefined });
	return json(yacht);
};
