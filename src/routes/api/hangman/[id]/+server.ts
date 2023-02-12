import { connection } from '$lib/connection';
import HangMan from '$lib/models/hang-man';
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
	return json(hangMan);
};
