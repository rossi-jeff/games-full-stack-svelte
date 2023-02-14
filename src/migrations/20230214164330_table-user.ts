import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('User', (table) => {
		table.increments('Id').primary();
		table.string('UserName', 100).notNullable();
		table.string('HashedPassWord', 255).notNullable();
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('User');
}
