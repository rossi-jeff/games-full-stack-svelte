import { connection } from './connection';
import Yacht from './models/yacht';
import YachtTurn from './models/yacht-turn';

export const yachtScore = async (Id: number) => {
	let Total = 0;
	YachtTurn.knex(connection);
	Yacht.knex(connection);
	const turns = await YachtTurn.query().where('YachtId', Id);
	if (turns && turns.length) {
		for (const turn of turns) Total += turn.Score ?? 0;
	}
	return await Yacht.query().findById(Id).patch({ Total });
};
