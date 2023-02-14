import { connection } from './connection';
import { Key } from './enum/key.enum';
import CodeBreaker from './models/code-breaker';
import CodeBreakerGuess from './models/code-breaker-guess';
import CodeBreakerGuessKey from './models/code-breaker-guess-key';

const perColumn = 10;
const perColor = 10;
const perBlack = 10;
const perWhite = 5;

export const codeBreakerScore = async (Id: number) => {
	CodeBreaker.knex(connection);
	CodeBreakerGuess.knex(connection);
	CodeBreakerGuessKey.knex(connection);
	let Score = 0,
		perGuess = 0,
		maxGuesses = 0,
		colorBonus = 0;
	const existing = await CodeBreaker.query().findById(Id);
	if (!existing) return Score;
	if (existing && existing.Colors) colorBonus = perColor * existing.Colors;
	if (existing && existing.Columns) {
		perGuess = perColumn * existing.Columns;
		maxGuesses = existing.Columns * 2;
		Score = maxGuesses * perGuess + colorBonus;
	}

	const guesses = await CodeBreakerGuess.query().where('CodeBreakerId', Id);
	if (guesses && guesses.length) {
		for (const guess of guesses) {
			Score -= perGuess;
			const keys = await CodeBreakerGuessKey.query().where('CodeBreakerGuessId', guess.Id);
			if (keys && keys.length) {
				for (const key of keys) {
					if (key.Key === Key.Black) Score += perBlack;
					if (key.Key === Key.White) Score += perWhite;
				}
			}
		}
	}
	return Score;
};
