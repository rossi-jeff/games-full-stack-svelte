import { connection } from '$lib/connection';
import SeaBattle from '$lib/models/sea-battle';
import SeaBattleShip from '$lib/models/sea-battle-ship';
import SeaBattleShipGridPoint from '$lib/models/sea-battle-ship-grid-point';
import User from '$lib/models/user';
import { json, type RequestHandler } from '@sveltejs/kit';
import SeaBattleShipHit from '../../../../lib/models/sea-battle-ship-hit';
import SeaBattleTurn from '../../../../lib/models/sea-battle-turn';
import SeaBattleTurnGridPoint from '../../../../lib/models/sea-battle-turn-grid-point';

export const GET: RequestHandler = async ({ request }) => {
	const id = parseInt(String(request.url.split('/').pop()));
	SeaBattle.knex(connection);
	const seaBattle = await SeaBattle.query().findById(id);
	if (seaBattle) {
		SeaBattleShip.knex(connection);
		SeaBattleTurn.knex(connection);
		seaBattle.ships = await SeaBattleShip.query().where('SeaBattleId', id);
		if (seaBattle.ships.length) {
			SeaBattleShipGridPoint.knex(connection);
			SeaBattleShipHit.knex(connection);
			for (const ship of seaBattle.ships) {
				ship.gridPoints = await SeaBattleShipGridPoint.query().where('SeaBattleShipId', ship.Id);
				ship.hits = await SeaBattleShipHit.query().where('SeaBattleShipId', ship.Id);
			}
		}
		seaBattle.turns = await SeaBattleTurn.query().where('SeaBattleId', id);
		if (seaBattle.turns.length) {
			SeaBattleTurnGridPoint.knex(connection);
			for (const turn of seaBattle.turns) {
				const gridPoint = await SeaBattleTurnGridPoint.query().where('SeaBattleTurnId', turn.Id);
				if (gridPoint.length) turn.gridPoint = gridPoint[0];
			}
		}
		if (seaBattle.UserId) {
			User.knex(connection);
			seaBattle.user = await User.query().findById(seaBattle.UserId);
		}
	}
	return json(seaBattle);
};
