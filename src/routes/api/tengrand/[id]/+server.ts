import { json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '../../../../lib/connection';
import TenGrand from '../../../../lib/models/ten-grand';
import TenGrandScore from '../../../../lib/models/ten-grand-score';
import TenGrandTurn from '../../../../lib/models/ten-grand-turn';
import User from '../../../../lib/models/user';

export const GET: RequestHandler = async ({ request }) => {
	const id = parseInt(String(request.url.split('/').pop()));
	TenGrand.knex(connection);
	const tenGrand = await TenGrand.query().findById(id);
	if (tenGrand) {
		TenGrandTurn.knex(connection);
		if (tenGrand.UserId) {
			User.knex(connection);
			tenGrand.user = await User.query().findById(tenGrand.UserId);
		}
		tenGrand.turns = await TenGrandTurn.query().where('TenGrandId', id);
		if (tenGrand.turns && tenGrand.turns.length) {
			TenGrandScore.knex(connection);
			for (const turn of tenGrand.turns) {
				turn.scores = await TenGrandScore.query().where('TenGrandTurnId', turn.Id);
			}
		}
	}
	return json(tenGrand);
};
