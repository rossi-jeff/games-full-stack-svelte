import type { Knex } from 'knex';

enum YachtCategory {
	BigStraight = 'BigStraight',
	Choice = 'Choice',
	Fives = 'Fives',
	FourOfKind = 'FourOfKind',
	Fours = 'Fours',
	FullHouse = 'FullHouse',
	LittleStraight = 'LittleStraight',
	Ones = 'Ones',
	Sixes = 'Sixes',
	Threes = 'Threes',
	Twos = 'Twos',
	Yacht = 'Yacht'
}

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('YachtTurn', (table) => {
		table.increments('Id').primary();
		table
			.integer('YachtId')
			.unsigned()
			.references('Id')
			.inTable('Yacht')
			.onDelete('CASCADE')
			.index();
		table.string('RollOne', 10).nullable();
		table.string('RollTwo', 10).nullable();
		table.string('RollThree', 10).nullable();
		table.enum('Category', Object.values(YachtCategory)).nullable();
		table.integer('Score').nullable().defaultTo(0);
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('YachtTurn');
}
