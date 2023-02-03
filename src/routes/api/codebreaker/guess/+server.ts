import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { colorValue } from '../../../../lib/enum/color.enum';
import CodeBreaker from '../../../../lib/models/code-breaker';
import CodeBreakerCode from '../../../../lib/models/code-breaker-code';
import CodeBreakerGuessColor from '../../../../lib/models/code-breaker-guess-color';
import type { ArgsCodeBreakerGuess } from '../../../../lib/types/args-code-breaker-guess.type';
import { connection } from '../../../../lib/connection';
import CodeBreakerGuessKey from '../../../../lib/models/code-breaker-guess-key';
import { Key } from '../../../../lib/enum/key.enum';
import CodeBreakerGuess from '../../../../lib/models/code-breaker-guess';
import { codeBreakerStatus } from '$lib/code-breaker-status';

export const POST: RequestHandler = async ({ request }) => {
	CodeBreaker.knex(connection);
	CodeBreakerGuess.knex(connection);
	const data: ArgsCodeBreakerGuess = await request.json();
	if (!data || !data.Colors || !data.Id) throw error(400, 'Bad Request');
	const { Id, Colors } = data;
	const existing = await CodeBreaker.query().findById(Id);
	if (!existing) throw error(404, 'Code Breaker not found');
	const guess = await CodeBreakerGuess.query().insert({
		CodeBreakerId: Id
	});
	if (guess) {
		const CodeBreakerGuessId = guess.Id;
		CodeBreakerGuessColor.knex(connection);
		CodeBreakerCode.knex(connection);
		CodeBreakerGuessKey.knex(connection);
		for (const name of Colors) {
			await CodeBreakerGuessColor.query().insert({
				CodeBreakerGuessId,
				Color: colorValue[name]
			});
		}
		const codes = await CodeBreakerCode.query()
			.where('CodeBreakerId', Id)
			.select('CodeBreakerCode.Color');
		const black: number[] = [];
		let white = 0;
		const correct: string[] = codes.map((c) => c.Color);
		for (let i = 0; i < codes.length; i++) {
			if (Colors[i] === correct[i]) black.push(i);
		}
		for (let i = black.length - 1; i >= 0; i--) {
			Colors.splice(black[i], 1);
			correct.splice(black[i], 1);
		}
		for (const color of Colors) {
			const idx = correct.indexOf(color);
			if (idx != -1) {
				white++;
				correct.splice(idx, 1);
			}
		}
		for (let i = 0; i < black.length; i++) {
			await CodeBreakerGuessKey.query().insert({
				CodeBreakerGuessId,
				Key: Key.Black
			});
		}
		for (let i = 0; i < white; i++) {
			await CodeBreakerGuessKey.query().insert({
				CodeBreakerGuessId,
				Key: Key.White
			});
		}
		guess.colors = await CodeBreakerGuessColor.query()
			.where('CodeBreakerGuessId', CodeBreakerGuessId)
			.select('CodeBreakerGuessColor.Color');
		guess.keys = await CodeBreakerGuessKey.query()
			.where('CodeBreakerGuessId', CodeBreakerGuessId)
			.select('CodeBreakerGuessKey.Key');
		const count = await CodeBreakerGuess.query().where('CodeBreakerId', Id);
		const status = codeBreakerStatus(black.length, codes.length, count.length);
		if (status !== 'Playing') {
			await CodeBreaker.query().findById(Id).patch({ Status: status });
		}
	}
	return json(guess);
};
