import { knex } from 'knex';
import { 
	SECRET_DB_HOST, 
	SECRET_DB_NAME, 
	SECRET_DB_PASS, 
	SECRET_DB_USER 
} from '$env/static/private'

const host = SECRET_DB_HOST ?? '127.0.0.1';
const user = SECRET_DB_USER ?? 'nodejs';
const password = SECRET_DB_PASS ?? 'typescript';
const database = SECRET_DB_NAME ?? 'games';

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
