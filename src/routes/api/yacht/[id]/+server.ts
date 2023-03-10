import { connection } from '$lib/connection';
import User from '$lib/models/user';
import Yacht from '$lib/models/yacht';
import YachtTurn from '$lib/models/yacht-turn';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
	const id = parseInt(String(request.url.split('/').pop()));
	Yacht.knex(connection);
	YachtTurn.knex(connection);
	const yacht = await Yacht.query().findById(id);
	if (yacht) {
		yacht.turns = await YachtTurn.query().where('YachtId', id);
		if (yacht.UserId) {
			User.knex(connection);
			yacht.user = await User.query().findById(yacht.UserId);
		}
	}
	return json(yacht);
};
