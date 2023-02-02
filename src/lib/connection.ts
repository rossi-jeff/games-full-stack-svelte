import { knex } from 'knex';

const host = process.env.DB_HOST ?? '127.0.0.1';
const user = process.env.DB_USER ?? 'nodejs';
const password = process.env.DB_PASS ?? 'typescript';
const database = process.env.DB_NAME ?? 'games';

export const connection = knex({
	client: 'mysql',
	connection: {
		host,
		port: 3306,
		user,
		password,
		database
	}
});
