import { connection } from '$lib/connection';
import Word from '$lib/models/word';
import type { ArgsWordRandom } from '$lib/types/args-word-random.type';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	Word.knex(connection);
	const data: ArgsWordRandom = await request.json();
	if (!data || !Object.keys(data).length) throw error(400, 'Bad Request');
	const { Length, Min, Max } = data;
	let count: number,
		offset: number,
		word: Word | null = null,
		wordResult: Word[],
		countResult;
	if (Length) {
		countResult = await Word.query().where('Length', Length).count('* as count');
		count = countResult[0].count;
		offset = Math.floor(Math.random() * count);
		wordResult = await Word.query()
			.where('Length', Length)
			.orderBy('Word', 'ASC')
			.offset(offset)
			.limit(1);
		word = wordResult[0];
	} else if (Min && Max) {
		countResult = await Word.query()
			.where('Length', '>=', Min)
			.where('Length', '<=', Max)
			.count('* as count');
		count = countResult[0].count;
		offset = Math.floor(Math.random() * count);
		wordResult = await Word.query()
			.where('Length', '>=', Min)
			.where('Length', '<=', Max)
			.orderBy('Word', 'ASC')
			.offset(offset)
			.limit(1);
		word = wordResult[0];
	} else if (Min) {
		countResult = await Word.query().where('Length', '>=', Min).count('* as count');
		count = countResult[0].count;
		offset = Math.floor(Math.random() * count);
		wordResult = await Word.query()
			.where('Length', '>=', Min)
			.orderBy('Word', 'ASC')
			.offset(offset)
			.limit(1);
		word = wordResult[0];
	} else if (Max) {
		countResult = await Word.query().where('Length', '<=', Max).count('* as count');
		count = countResult[0].count;
		offset = Math.floor(Math.random() * count);
		wordResult = await Word.query()
			.where('Length', '<=', Max)
			.orderBy('Word', 'ASC')
			.offset(offset)
			.limit(1);
		word = wordResult[0];
	}
	return json(word ?? {});
};
