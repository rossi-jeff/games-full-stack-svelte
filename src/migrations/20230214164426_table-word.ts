import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('Word', (table) => {
		table.increments('Id').primary();
		table.string('Word', 25).notNullable();
		table.integer('Length').notNullable();
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('Word');
}
