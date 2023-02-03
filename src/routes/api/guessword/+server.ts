import GuessWord from '../../../lib/models/guess-word';
import type { RequestHandler } from './$types';
import { connection } from '../../../lib/connection';
import { error, json } from '@sveltejs/kit';
import { GameStatus } from '../../../lib/enum/game-status.enum';

export const POST: RequestHandler = async ({ request }) => {
	GuessWord.knex(connection);
	const data: { WordId: number } = await request.json();
	if (!data || !data.WordId) throw error(400, 'Bad Request');
	const { WordId } = data;
	const guessWord = await GuessWord.query().insert({
		WordId,
		Status: GameStatus.Playing,
		Score: 0
	});
	return json(guessWord);
};
