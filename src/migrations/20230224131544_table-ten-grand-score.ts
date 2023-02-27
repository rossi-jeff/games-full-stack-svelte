import type { Knex } from 'knex';

enum TenGrandCategory {
	Ones = 'Ones',
	Fives = 'Fives',
	ThreePairs = 'ThreePairs',
	Straight = 'Straight',
	FullHouse = 'FullHouse',
	DoubleThreeKind = 'DoubleThreeKind',
	ThreeKind = 'ThreeKind',
	FourKind = 'FourKind',
	FiveKind = 'FiveKind',
	SixKind = 'SixKind',
	CrapOut = 'CrapOut'
}

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('TenGrandScore', (table) => {
		table.increments('Id').primary();
		table
			.integer('TenGrandTurnId')
			.unsigned()
			.notNullable()
			.references('Id')
			.inTable('TenGrandTurn')
			.onDelete('CASCADE')
			.index();
		table.string('Dice', 10).nullable();
		table.enum('Category', Object.values(TenGrandCategory)).nullable();
		table.integer('Score').notNullable().defaultTo(0);
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('TenGrandScore');
}
