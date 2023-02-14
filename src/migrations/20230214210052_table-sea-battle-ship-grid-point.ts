import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('SeaBattleShipGridPoint', (table) => {
		table.increments('Id').primary();
		table
			.integer('SeaBattleShipId')
			.unsigned()
			.references('Id')
			.inTable('SeaBattleShip')
			.onDelete('CASCADE')
			.index();
		table.string('Horizontal', 1).nullable();
		table.integer('Vertical').nullable();
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('SeaBattleShipGridPoint');
}
