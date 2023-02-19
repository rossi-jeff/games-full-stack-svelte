import { error, json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '../../../../lib/connection';
import Klondike from '../../../../lib/models/klondike';
import type { ArgsKlondikeUpdate } from '../../../../lib/types/args-klondike-update.type';

export const PATCH: RequestHandler = async ({ request }) => {
	const id = request.url.split('/').pop();
	const data: ArgsKlondikeUpdate = await request.json();
	if (!data || data.Elapsed === undefined || data.Moves === undefined || !data.Status || !id)
		throw error(400, 'Bad Request');
	const { Elapsed, Moves, Status } = data;
	Klondike.knex(connection);
	await Klondike.query().findById(parseInt(id)).patch({
		Elapsed,
		Moves,
		Status
	});
	const klondike = await Klondike.query().findById(parseInt(id));
	return json(klondike);
};
