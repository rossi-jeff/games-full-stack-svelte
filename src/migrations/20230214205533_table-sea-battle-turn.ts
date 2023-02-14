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

enum Target {
	Hit = 'Hit',
	Miss = 'Miss',
	Sunk = 'Sunk'
}

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('SeaBattleTurn', (table) => {
		table.increments('Id').primary();
		table
			.integer('SeaBattleId')
			.unsigned()
			.references('Id')
			.inTable('SeaBattle')
			.onDelete('CASCADE')
			.index();
		table.enum('ShipType', Object.values(ShipType)).nullable();
		table.enum('Navy', Object.values(Navy)).nullable();
		table.enum('Target', Object.values(Target)).nullable();
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('SeaBattleTurn');
}
