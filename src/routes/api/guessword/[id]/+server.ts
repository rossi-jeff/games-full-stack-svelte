import User from '$lib/models/user';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { connection } from '../../../../lib/connection';
import GuessWord from '../../../../lib/models/guess-word';
import GuessWordGuess from '../../../../lib/models/guess-word-guess';
import GuessWordGuessRating from '../../../../lib/models/guess-word-guess-rating';
import Word from '../../../../lib/models/word';

export const GET: RequestHandler = async ({ request }) => {
	const id = parseInt(String(request.url.split('/').pop()));
	Word.knex(connection);
	GuessWord.knex(connection);
	GuessWordGuess.knex(connection);
	GuessWordGuessRating.knex(connection);
	const guessWord = await GuessWord.query().findById(id);
	if (guessWord) {
		guessWord.word = await Word.query().findById(guessWord.WordId);
		guessWord.guesses = await GuessWordGuess.query().where('GuessWordId', id);
		for (const guess of guessWord.guesses) {
			guess.ratings = await GuessWordGuessRating.query().where('GuessWordGuessId', guess.Id);
		}
		if (guessWord.UserId) {
			User.knex(connection)
			guessWord.user = await User.query().findById(guessWord.UserId)
		}
	}
	return json(guessWord);
};
