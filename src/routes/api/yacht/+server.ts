import { connection } from '$lib/connection';
import Yacht from '$lib/models/yacht';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
	Yacht.knex(connection);
	const yacht = await Yacht.query().insert({});
	return json(yacht);
};
