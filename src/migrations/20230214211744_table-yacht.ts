import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('Yacht', (table) => {
		table.increments('Id').primary();
		table
			.integer('UserId')
			.unsigned()
			.nullable()
			.references('Id')
			.inTable('User')
			.onDelete('CASCADE')
			.index();
		table.integer('Total').nullable().defaultTo(0);
		table.integer('NumTurns').nullable().defaultTo(0);
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('Yacht');
}
