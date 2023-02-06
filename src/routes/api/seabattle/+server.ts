import { connection } from '$lib/connection';
import SeaBattle from '$lib/models/sea-battle';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data: { Axis: number } = await request.json();
	if (!data || !data.Axis) throw error(400, 'Bad Request');
	const { Axis } = data;
	SeaBattle.knex(connection);
	const seaBattle = await SeaBattle.query().insert({
		Axis
	});
	return json(seaBattle);
};
