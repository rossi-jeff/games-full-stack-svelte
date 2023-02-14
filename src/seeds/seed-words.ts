import type { Knex } from 'knex';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const fileToArray = (fileName: string) => fs.readFileSync(fileName).toString('utf-8').split('\n');

const wordList = fileToArray(path.resolve(__dirname, './usa2.txt'));

const alpha = /^[a-zA-Z]+$/;
let count = 0;

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex('Word').del();

	// Inserts seed entries
	for (const Word of wordList) {
		if (Word.length < 4) continue;
		if (!Word.match(alpha)) continue;
		await knex('Word').insert({
			Word,
			Length: Word.length
		});
		count++;
		if (count % 1000 === 0) console.log(`${count} words added`);
	}
	console.log(`${count} words added`);
	return;
}
