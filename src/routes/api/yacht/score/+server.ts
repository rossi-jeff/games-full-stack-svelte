import { connection } from '$lib/connection';
import YachtTurn from '$lib/models/yacht-turn';
import type { ArgsYachtScore } from '$lib/types/args-yacht-score.type';
import {
	scoreBigStraight,
	scoreChoice,
	scoreFourKind,
	scoreFullHouse,
	scoreLittleStraight,
	scoreNumber,
	scoreYacht
} from '$lib/yacht-functions';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { yachtScore } from '../../../../lib/yacht-score';

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsYachtScore = await request.json();
	if (!data || !data.Category || !data.TurnId) throw error(400, 'Bad Request');
	const { TurnId, Category } = data;
	YachtTurn.knex(connection);
	const turn = await YachtTurn.query().findById(TurnId);
	if (!turn) throw error(404, 'Turn not Found');
	let dice: number[] = [];
	let Score = 0;
	if (turn.RollThree) {
		dice = turn.RollThree.split(',').map((d) => parseInt(d));
	} else if (turn.RollTwo) {
		dice = turn.RollTwo.split(',').map((d) => parseInt(d));
	} else if (turn.RollOne) {
		dice = turn.RollOne.split(',').map((d) => parseInt(d));
	}
	switch (Category) {
		case 'Ones':
			Score = scoreNumber(dice, 1);
			break;
		case 'Twos':
			Score = scoreNumber(dice, 2);
			break;
		case 'Threes':
			Score = scoreNumber(dice, 3);
			break;
		case 'Fours':
			Score = scoreNumber(dice, 4);
			break;
		case 'Fives':
			Score = scoreNumber(dice, 5);
			break;
		case 'Sixes':
			Score = scoreNumber(dice, 6);
			break;
		case 'FullHouse':
			Score = scoreFullHouse(dice);
			break;
		case 'FourOfKind':
			Score = scoreFourKind(dice);
			break;
		case 'BigStraight':
			Score = scoreBigStraight(dice);
			break;
		case 'LittleStraight':
			Score = scoreLittleStraight(dice);
			break;
		case 'Choice':
			Score = scoreChoice(dice);
			break;
		case 'Yacht':
			Score = scoreYacht(dice);
			break;
	}
	await YachtTurn.query().findById(TurnId).patch({ Category, Score });
	if (turn && turn.YachtId) await yachtScore(turn.YachtId);
	const updated = await YachtTurn.query().findById(TurnId);
	return json(updated);
};
