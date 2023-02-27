import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { ArgsTenGrandRoll } from '../../../../lib/types/args-ten-grand-roll.type';
import { rollDie } from '../../../../lib/yacht-functions';

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsTenGrandRoll = await request.json();
	if (!data || !data.Quantity) throw error(400, 'Bad Request');
	const { Quantity } = data;
	const Dice: number[] = [];
	while (Dice.length < Quantity) Dice.push(rollDie());
	return json(Dice);
};
