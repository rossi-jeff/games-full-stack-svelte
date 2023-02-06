import { connection } from '$lib/connection';
import SeaBattle from '$lib/models/sea-battle';
import SeaBattleShip from '$lib/models/sea-battle-ship';
import SeaBattleShipGridPoint from '$lib/models/sea-battle-ship-grid-point';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
	const id = parseInt(String(request.url.split('/').pop()));
	SeaBattle.knex(connection);
	const seaBattle = await SeaBattle.query().findById(id);
	if (seaBattle) {
		SeaBattleShip.knex(connection);
		seaBattle.ships = await SeaBattleShip.query().where('SeaBattleId', id);
		if (seaBattle.ships.length) {
			SeaBattleShipGridPoint.knex(connection);
			for (const ship of seaBattle.ships) {
				ship.gridPoints = await SeaBattleShipGridPoint.query().where('SeaBattleShipId', ship.Id);
			}
		}
	}
	return json(seaBattle);
};
