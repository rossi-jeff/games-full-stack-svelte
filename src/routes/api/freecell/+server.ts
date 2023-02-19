import { json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '../../../lib/connection';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';
import FreeCell from '../../../lib/models/free-cell';

export const POST: RequestHandler = async ({ request }) => {
	const { UserId } = decodeAuthHeader(request.headers);
	FreeCell.knex(connection);
	const freecell = await FreeCell.query().insert({
		UserId: UserId ?? undefined
	});
	return json(freecell);
};
