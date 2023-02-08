import { connection } from '$lib/connection';
import Yacht from '$lib/models/yacht';
import { json, type RequestHandler } from '@sveltejs/kit';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';

export const POST: RequestHandler = async ({ request }) => {
	Yacht.knex(connection);
	const { UserId } = decodeAuthHeader(request.headers.get('Authorization'));
	const yacht = await Yacht.query().insert({ UserId: UserId ?? undefined });
	return json(yacht);
};
