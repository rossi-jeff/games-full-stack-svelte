import { connection } from '$lib/connection';
import SeaBattle from '$lib/models/sea-battle';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';

export const POST: RequestHandler = async ({ request }) => {
	const data: { Axis: number } = await request.json();
	if (!data || !data.Axis) throw error(400, 'Bad Request');
	const { Axis } = data;
	const { UserId } = decodeAuthHeader(request.headers.get('Authorization'));
	SeaBattle.knex(connection);
	const seaBattle = await SeaBattle.query().insert({
		Axis,
		UserId: UserId ?? undefined
	});
	return json(seaBattle);
};
