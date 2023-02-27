import { error, json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '../../../../lib/connection';
import TenGrandScore from '../../../../lib/models/ten-grand-score';
import TenGrandTurn from '../../../../lib/models/ten-grand-turn';
import { getCategoryScoreAndDice, sortByDicerequired } from '../../../../lib/ten-grand-functions';
import type { ArgsTenGrandScore } from '../../../../lib/types/args-ten-grand-score.type';
import { TenGrandCategory } from '../../../../lib/enum/ten-grand-category.enum';
import { updateGameScore, updateTurnScore } from '../../../../lib/ten-grand-server-functions';

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsTenGrandScore = await request.json();
	if (!data || data.GameId === 0 || !data.Dice || !data.Options) throw error(400, 'Bad Request');
	const { GameId, TurnId, Dice, Options } = data;
	let turn: TenGrandTurn | undefined;
	TenGrandTurn.knex(connection);
	if (TurnId) {
		turn = await TenGrandTurn.query().findById(TurnId);
	} else {
		turn = await TenGrandTurn.query().insert({
			TenGrandId: GameId
		});
	}
	if (turn) {
		TenGrandScore.knex(connection);
		Options.sort(sortByDicerequired);
		for (const option of Options) {
			const { Score, Used } = getCategoryScoreAndDice(option.Category, Dice);
			for (const face of Used) {
				const idx = Dice.indexOf(face);
				if (idx !== -1) Dice.splice(idx, 1);
			}
			await TenGrandScore.query().insert({
				TenGrandTurnId: turn.Id,
				Score,
				Category: option.Category ?? TenGrandCategory.CrapOut,
				Dice: Used.join(',')
			});
		}
		turn.scores = await TenGrandScore.query().where('TenGrandTurnId', turn.Id);
		turn.Score = await updateTurnScore(turn.Id);
		await updateGameScore(GameId);
	}
	return json(turn);
};
