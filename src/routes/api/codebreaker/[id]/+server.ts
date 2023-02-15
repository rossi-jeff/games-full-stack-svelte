import User from '$lib/models/user';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { connection } from '../../../../lib/connection';
import CodeBreaker from '../../../../lib/models/code-breaker';
import CodeBreakerCode from '../../../../lib/models/code-breaker-code';
import CodeBreakerGuess from '../../../../lib/models/code-breaker-guess';
import CodeBreakerGuessColor from '../../../../lib/models/code-breaker-guess-color';
import CodeBreakerGuessKey from '../../../../lib/models/code-breaker-guess-key';

export const GET: RequestHandler = async ({ request }) => {
	const id = parseInt(String(request.url.split('/').pop()));
	CodeBreaker.knex(connection);
	const codeBreaker = await CodeBreaker.query().findById(id);
	if (codeBreaker) {
		CodeBreakerCode.knex(connection);
		CodeBreakerGuess.knex(connection);
		CodeBreakerGuessColor.knex(connection);
		CodeBreakerGuessKey.knex(connection);
		codeBreaker.codes = await CodeBreakerCode.query()
			.where('CodeBreakerId', id)
			.select('CodeBreakerCode.Color');
		codeBreaker.guesses = [];
		const guesses = await CodeBreakerGuess.query()
			.where('CodeBreakerId', id)
			.select('CodeBreakerGuess.Id');
		for (const guess of guesses) {
			guess.colors = await CodeBreakerGuessColor.query()
				.where('CodeBreakerGuessId', guess.Id)
				.select('CodeBreakerGuessColor.Color');
			guess.keys = await CodeBreakerGuessKey.query()
				.where('CodeBreakerGuessId', guess.Id)
				.select('CodeBreakerGuessKey.Key');
			codeBreaker.guesses.push(guess);
		}
		if (codeBreaker.UserId) {
			User.knex(connection)
			codeBreaker.user = await User.query().findById(codeBreaker.UserId)
		}
	}
	return json(codeBreaker);
};
