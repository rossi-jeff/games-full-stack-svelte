import type { Knex } from 'knex';

enum ShipType {
	BattleShip = 'BattleShip',
	Carrier = 'Carrier',
	Cruiser = 'Cruiser',
	PatrolBoat = 'PatrolBoat',
	SubMarine = 'SubMarine'
}

enum Navy {
	Opponent = 'Opponent',
	Player = 'Player'
}

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('SeaBattleShip', (table) => {
		table.increments('Id').primary();
		table
			.integer('SeaBattleId')
			.unsigned()
			.references('Id')
			.inTable('SeaBattle')
			.onDelete('CASCADE')
			.index();
		table.enum('Type', Object.values(ShipType)).notNullable();
		table.enum('Navy', Object.values(Navy)).notNullable();
		table.integer('Size').notNullable();
		table.boolean('Sunk').nullable().defaultTo(false);
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('SeaBattleShip');
}
