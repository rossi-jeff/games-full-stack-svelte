import { connection } from './connection';
import { Rating } from './enum/rating.enum';
import GuessWord from './models/guess-word';
import GuessWordGuess from './models/guess-word-guess';
import GuessWordGuessRating from './models/guess-word-guess-rating';

const perGreen = 10;
const perBrown = 5;

export const guessWordScore = async (Id: number, length: number) => {
	GuessWordGuess.knex(connection);
	GuessWordGuessRating.knex(connection);
	const perGuess = length * perGreen,
		maxGuesses = Math.ceil((length * 3) / 2);
	let Score = perGuess * maxGuesses;
	const guesses = await GuessWordGuess.query().where('GuessWordId', Id);
	if (guesses && guesses.length) {
		for (const guess of guesses) {
			Score -= perGuess;
			const ratings = await GuessWordGuessRating.query().where('GuessWordGuessId', guess.Id);
			if (ratings && ratings.length) {
				for (const rating of ratings) {
					if (rating.Rating === Rating.Green) Score += perGreen;
					if (rating.Rating === Rating.Brown) Score += perBrown;
				}
			}
		}
	}
	return Score;
};
