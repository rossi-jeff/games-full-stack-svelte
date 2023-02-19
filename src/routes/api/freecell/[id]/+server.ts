import { error, json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '../../../../lib/connection';
import FreeCell from '../../../../lib/models/free-cell';
import type { ArgsFreeCellUpdate } from '../../../../lib/types/args-freee-cell-update.type';

export const PATCH: RequestHandler = async ({ request }) => {
	const id = request.url.split('/').pop();
	const data: ArgsFreeCellUpdate = await request.json();
	if (!data || data.Elapsed === undefined || data.Moves === undefined || !data.Status || !id)
		throw error(400, 'Bad Request');
	const { Elapsed, Moves, Status } = data;
	FreeCell.knex(connection);
	await FreeCell.query().findById(parseInt(id)).patch({
		Elapsed,
		Moves,
		Status
	});
	const freecell = await FreeCell.query().findById(parseInt(id));
	return json(freecell);
};
