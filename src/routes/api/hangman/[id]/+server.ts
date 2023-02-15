import { connection } from '$lib/connection';
import HangMan from '$lib/models/hang-man';
import User from '$lib/models/user';
import { json, type RequestHandler } from '@sveltejs/kit';
import Word from '../../../../lib/models/word';

export const GET: RequestHandler = async ({ request }) => {
	const id = parseInt(String(request.url.split('/').pop()));
	HangMan.knex(connection);
	const hangMan = await HangMan.query().findById(id);
	if (hangMan && hangMan.WordId) {
		Word.knex(connection);
		hangMan.word = await Word.query().findById(hangMan.WordId);
	}
	if (hangMan && hangMan.UserId) {
		User.knex(connection);
		hangMan.user = await User.query().findById(hangMan.UserId);
	}
	return json(hangMan);
};
