import { seaBattleOpponentShip, seaBattlePlayerShip } from '$lib/sea-battle-server-functions';
import type { ArgsSeaBattleShip } from '$lib/types/args-sea-battle-ship';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsSeaBattleShip = await request.json();
	if (!data || !data.Id || !data.Navy || !data.ShipType || !data.Size)
		throw error(400, 'Bad Request');
	const { Id, Navy, ShipType, Size } = data;
	let ship;
	if (String(Navy) === 'Player') {
		ship = seaBattlePlayerShip(Id, ShipType, Size, data.Points);
	} else {
		ship = seaBattleOpponentShip(Id, ShipType, Size);
	}
	return json(ship);
};
