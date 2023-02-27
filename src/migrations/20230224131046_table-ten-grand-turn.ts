import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('TenGrandTurn', (table) => {
		table.increments('Id').primary();
		table
			.integer('TenGrandId')
			.unsigned()
			.notNullable()
			.references('Id')
			.inTable('TenGrand')
			.onDelete('CASCADE')
			.index();
		table.integer('Score').notNullable().defaultTo(0);
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('TenGrandTurn');
}
