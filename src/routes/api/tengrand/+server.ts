import { json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '../../../lib/connection';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';
import TenGrand from '../../../lib/models/ten-grand';

export const POST: RequestHandler = async ({ request }) => {
	TenGrand.knex(connection);
	const { UserId } = decodeAuthHeader(request.headers);
	const tenGrand = await TenGrand.query().insert({ UserId: UserId ?? undefined });
	return json(tenGrand);
};
