import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('SeaBattleTurnGridPoint', (table) => {
		table.increments('Id').primary();
		table
			.integer('SeaBattleTurnId')
			.unsigned()
			.references('Id')
			.inTable('SeaBattleTurn')
			.onDelete('CASCADE')
			.index();
		table.string('Horizontal', 1).nullable();
		table.integer('Vertical').nullable();
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('SeaBattleTurnGridPoint');
}
