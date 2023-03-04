import { error, json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '../../../../lib/connection';
import Word from '../../../../lib/models/word';
import type { ArgsGuessWordHint } from '../../../../lib/types/args-guess-word-hint.type';
import {
	includeAllBrown,
	matchBrown,
	matchGray,
	matchGreen
} from '../../../../lib/guess-word-hint-functions';

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsGuessWordHint = await request.json();
	if (!data || !data.Green || !data.Brown || !data.Gray || !data.Length)
		throw error(400, 'Bad Request');
	const { Green, Brown, Gray, Length } = data;
	Word.knex(connection);
	const result = await Word.query().where('Length', Length).select('Word');
	const allWords = result.map((w) => w.Word);
	const Hints: string[] = [];
	for (const word of allWords) {
		if (!matchGreen(word, Green)) continue;
		if (matchBrown(word, Brown)) continue;
		if (matchGray(word, Gray, Green)) continue;
		if (!includeAllBrown(word, Brown)) continue;
		Hints.push(word);
	}
	return json(Hints);
};
