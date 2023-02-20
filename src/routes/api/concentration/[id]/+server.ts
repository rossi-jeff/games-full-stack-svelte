import { error, json, type RequestHandler } from '@sveltejs/kit';
import Concentration from '../../../../lib/models/concentration';
import type { ArgsConcentrationUpdate } from '../../../../lib/types/args-concentration-update.type';
import { connection } from '../../../../lib/connection';
import User from '$lib/models/user';

Concentration.knex(connection);

export const GET: RequestHandler = async ({ request }) => {
	const id = parseInt(String(request.url.split('/').pop()));
	const concentration = await Concentration.query().findById(id);
	if (concentration && concentration.UserId) {
		User.knex(connection);
		concentration.user = await User.query().findById(concentration.UserId)
	}
	return json(concentration)
}

export const PATCH: RequestHandler = async ({ request }) => {
	const id = request.url.split('/').pop();
	const data: ArgsConcentrationUpdate = await request.json();
	if (
		!data ||
		data.Elapsed === undefined ||
		data.Moves === undefined ||
		data.Matched === undefined ||
		!data.Status ||
		!id
	)
		throw error(400, 'Bad Request');
	const { Elapsed, Moves, Status, Matched } = data;
	await Concentration.query()
		.findById(parseInt(id))
		.patch({ Elapsed, Moves, Status, Matched });
	const concentraton = await Concentration.query().findById(parseInt(id));
	return json(concentraton);
};
