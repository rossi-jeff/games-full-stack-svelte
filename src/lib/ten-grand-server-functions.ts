import { TenGrandCategory } from './enum/ten-grand-category.enum';
import TenGrandScore from './models/ten-grand-score';
import TenGrandTurn from './models/ten-grand-turn';
import { connection } from './connection';
import TenGrand from './models/ten-grand';
import { GameStatus } from './enum/game-status.enum';

export const updateTurnScore = async (TurnId: number) => {
	TenGrandScore.knex(connection);
	TenGrandTurn.knex(connection);
	let Score = 0;
	let crapOut = false;
	const results = await TenGrandScore.query().where('TenGrandTurnId', TurnId);
	for (const score of results) {
		Score += score.Score ?? 0;
		if (score.Category === TenGrandCategory.CrapOut) crapOut = true;
	}
	if (crapOut) Score = 0;
	await TenGrandTurn.query().findById(TurnId).patch({ Score });
	return Score;
};

export const updateGameScore = async (GameId: number) => {
	let Score = 0;
	TenGrandTurn.knex(connection);
	TenGrand.knex(connection);
	const results = await TenGrandTurn.query().where('TenGrandId', GameId);
	for (const turn of results) {
		Score += turn.Score ?? 0;
	}
	const Status = Score >= 10000 ? GameStatus.Won : GameStatus.Playing;
	await TenGrand.query().findById(GameId).patch({ Score, Status });
};
