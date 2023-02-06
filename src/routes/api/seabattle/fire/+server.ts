import { error, type RequestHandler, json } from '@sveltejs/kit';
import type { ArgsSeaBattleFire } from '../../../../lib/types/args-sea-battle-fire.type';
import {
	seaBattlePlayerFire,
	seaBattleOpponentFire,
	seaBattleStatus
} from '../../../../lib/sea-battle-server-functions';
import { GameStatus } from '../../../../lib/enum/game-status.enum';
import SeaBattle from '../../../../lib/models/sea-battle';
import { connection } from '../../../../lib/connection';

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsSeaBattleFire = await request.json();
	if (!data || !data.Id || !data.Navy) throw error(400, 'Bad Request');
	const { Id, Navy } = data;
	let turn;
	if (String(Navy) === 'Player') {
		const { Horizontal, Vertical } = data;
		turn = await seaBattlePlayerFire(Id, Horizontal, Vertical);
	} else {
		turn = await seaBattleOpponentFire(Id);
	}
	const Status = await seaBattleStatus(Id);
	if (Status != GameStatus.Playing) {
		SeaBattle.knex(connection);
		await SeaBattle.query().findById(Id).patch({ Status });
	}
	return json(turn);
};
