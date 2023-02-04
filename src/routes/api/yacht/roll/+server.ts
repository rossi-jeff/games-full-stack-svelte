import { connection } from '$lib/connection';
import YachtTurn from '$lib/models/yacht-turn';
import type { ArgsYachtRoll } from '$lib/types/args-yacht-roll.type';
import { buildScoreOptions, rollDie } from '$lib/yacht-functions';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsYachtRoll = await request.json();
	if (!data || !data.YachtId || !data.Keep) throw error(400, 'Bad Request');
	const { YachtId, Keep } = data;
	const Dice: number[] = [...Keep];
	while (Dice.length < 5) Dice.push(rollDie());
	YachtTurn.knex(connection);
	const lastTurnResult = await YachtTurn.query()
		.where('YachtId', YachtId)
		.where('Category', null)
		.orderBy('Id', 'DESC')
		.limit(1);
	const lastTurn = lastTurnResult[0];
	let Turn;
	const scored = await YachtTurn.query()
		.where('YachtId', YachtId)
		.whereNot('Category', null)
		.select('Category');
	const skip = scored.map((t) => String(t.Category));
	if (lastTurn && !lastTurn.RollThree) {
		if (lastTurn.RollTwo) {
			await YachtTurn.query()
				.findById(lastTurn.Id)
				.patch({
					RollThree: Dice.join(',')
				});
		} else if (lastTurn.RollOne) {
			await YachtTurn.query()
				.findById(lastTurn.Id)
				.patch({
					RollTwo: Dice.join(',')
				});
		}
		Turn = await YachtTurn.query().findById(lastTurn.Id);
	} else {
		Turn = await YachtTurn.query().insert({
			YachtId,
			RollOne: Dice.join(',')
		});
	}
	const Options = buildScoreOptions(Dice, skip);
	return json({ Turn, Options });
};
