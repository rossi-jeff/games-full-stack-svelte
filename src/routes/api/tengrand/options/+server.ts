import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { ArgsTenGrandOptions } from '../../../../lib/types/args-ten-grand-options.type';
import { getTenGrandOptions, sortByScore } from '../../../../lib/ten-grand-functions';

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsTenGrandOptions = await request.json();
	if (!data || !data.Dice) throw error(400, 'Bad Request');
	const { Dice } = data;
	const Options = getTenGrandOptions(Dice);
	Options.sort(sortByScore);
	return json({ Dice, Options });
};
