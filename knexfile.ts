import type { Knex } from 'knex';

const host = process.env.SECRET_DB_HOST || '127.0.0.1';
const user = process.env.SECRET_DB_USER || 'nodejs';
const password = process.env.SECRET_DB_PASS || 'typescript';
const database = process.env.SECRET_DB_NAME || 'games_svelte';

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
	development: {
		client: 'mysql',
		connection: {
			host,
			port: 3306,
			user,
			password,
			database
		},
		migrations: {
			directory: './src/migrations',
			extension: 'ts'
		}
	},

	staging: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}
};

export default config;
