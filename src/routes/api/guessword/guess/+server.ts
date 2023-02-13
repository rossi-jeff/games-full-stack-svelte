import type { RequestHandler } from '../$types';
import type { ArgsGuessWordGuess } from '../../../../lib/types/args-guess-word-guess';
import { error, json } from '@sveltejs/kit';
import GuessWordGuess from '../../../../lib/models/guess-word-guess';
import { connection } from '../../../../lib/connection';
import GuessWordGuessRating from '../../../../lib/models/guess-word-guess-rating';
import { Rating } from '../../../../lib/enum/rating.enum';
import { guessWordStatus } from '../../../../lib/guess-word-status';
import GuessWord from '../../../../lib/models/guess-word';
import { guessWordScore } from '../../../../lib/guess-word-score';

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsGuessWordGuess = await request.json();
	if (!data || !data.Word || !data.Guess || !data.Id || data.Guess.length != data.Word.length)
		throw error(400, 'Bad Request');
	GuessWordGuess.knex(connection);
	const { Id, Guess, Word } = data;
	const green: number[] = [];
	const brown: number[] = [];
	const gray: number[] = [];
	let letter: string;
	let idx: number;
	const word: string[] = Word.split('');
	for (let i = Word.length - 1; i >= 0; i--) {
		letter = Guess[i];
		if (letter === word[i]) {
			green.push(i);
			word[i] = '';
		}
	}
	for (let i = Word.length - 1; i >= 0; i--) {
		if (green.includes(i)) continue;
		letter = Guess[i];
		if (word.includes(letter)) {
			brown.push(i);
			idx = word.indexOf(letter);
			if (idx != -1) word[idx] = '';
		} else {
			gray.push(i);
		}
	}
	const guess = await GuessWordGuess.query().insert({
		GuessWordId: Id,
		Guess
	});

	if (guess) {
		guess.ratings = [];
		let rating;
		GuessWordGuessRating.knex(connection);
		for (let i = 0; i < Word.length; i++) {
			if (green.includes(i)) {
				rating = await GuessWordGuessRating.query().insert({
					GuessWordGuessId: guess.Id,
					Rating: Rating.Green
				});
				guess.ratings.push(rating);
			} else if (gray.includes(i)) {
				rating = await GuessWordGuessRating.query().insert({
					GuessWordGuessId: guess.Id,
					Rating: Rating.Gray
				});
				guess.ratings.push(rating);
			} else if (brown.includes(i)) {
				rating = await GuessWordGuessRating.query().insert({
					GuessWordGuessId: guess.Id,
					Rating: Rating.Brown
				});
				guess.ratings.push(rating);
			}
		}
		const countResult = await GuessWordGuess.query().where('GuessWordId', Id).count('* as count');
		if (countResult) {
			const Status = guessWordStatus(green.length, Word.length, countResult[0].count);
			if (Status !== 'Playing') {
				GuessWord.knex(connection);
				const Score = await guessWordScore(Id, Word.length);
				await GuessWord.query().findById(Id).patch({ Status, Score });
			}
		}
	}
	return json(guess);
};
