import { connection } from '$lib/connection';
import User from '$lib/models/user';
import Yacht from '$lib/models/yacht';
import { json, type RequestHandler } from '@sveltejs/kit';
import { defaultLimit, defaultOffset } from '../../../lib/constants';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';
import { YachtCategory } from '../../../lib/enum/yacht-category.enum';

export const GET: RequestHandler = async ({ url }) => {
	const Limit = url.searchParams.get('Limit');
	const Offset = url.searchParams.get('Offset');
	const limit = Limit ? parseInt(Limit) : defaultLimit;
	const offset = Offset ? parseInt(Offset) : defaultOffset;
	const NumCategories = Object.values(YachtCategory).length;
	Yacht.knex(connection);
	const Items = await Yacht.query()
		.where('NumTurns', '>=', NumCategories)
		.orderBy('Total', 'DESC')
		.limit(limit)
		.offset(offset);
	const countResult = await Yacht.query()
		.where('NumTurns', '>=', NumCategories)
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
	Yacht.knex(connection);
	const { UserId } = decodeAuthHeader(request.headers);
	const yacht = await Yacht.query().insert({ UserId: UserId ?? undefined });
	return json(yacht);
};
