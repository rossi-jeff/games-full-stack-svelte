import { connection } from '$lib/connection';
import { GameStatus } from '$lib/enum/game-status.enum';
import HangMan from '$lib/models/hang-man';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data: { WordId: number } = await request.json();
	if (!data || !data.WordId) throw error(400, 'Bad Request');
	HangMan.knex(connection);
	const { WordId } = data;
	const hangMan = await HangMan.query().insert({
		WordId,
		Correct: '',
		Wrong: '',
		Status: GameStatus.Playing,
		Score: 0
	});
	return json(hangMan);
};
