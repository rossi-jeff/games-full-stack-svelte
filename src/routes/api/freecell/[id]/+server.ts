import User from '$lib/models/user';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '../../../../lib/connection';
import FreeCell from '../../../../lib/models/free-cell';
import type { ArgsFreeCellUpdate } from '../../../../lib/types/args-freee-cell-update.type';

FreeCell.knex(connection);

export const GET: RequestHandler = async ({ request }) => {
	const id = parseInt(String(request.url.split('/').pop()));
	const freecell = await FreeCell.query().findById(id);
	if (freecell && freecell.UserId) {
		User.knex(connection);
		freecell.user = await User.query().findById(freecell.UserId)
	}
	return json(freecell);
}

export const PATCH: RequestHandler = async ({ request }) => {
	const id = request.url.split('/').pop();
	const data: ArgsFreeCellUpdate = await request.json();
	if (!data || data.Elapsed === undefined || data.Moves === undefined || !data.Status || !id)
		throw error(400, 'Bad Request');
	const { Elapsed, Moves, Status } = data;
	await FreeCell.query().findById(parseInt(id)).patch({
		Elapsed,
		Moves,
		Status
	});
	const freecell = await FreeCell.query().findById(parseInt(id));
	return json(freecell);
};
