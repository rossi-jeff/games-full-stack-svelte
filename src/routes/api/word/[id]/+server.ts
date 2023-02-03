import { json } from '@sveltejs/kit';
import { connection } from '../../../../lib/connection';
import Word from '../../../../lib/models/word';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const id = parseInt(String(request.url.split('/').pop()));
	Word.knex(connection);
	const word = await Word.query().findById(id);
	return json(word);
};
