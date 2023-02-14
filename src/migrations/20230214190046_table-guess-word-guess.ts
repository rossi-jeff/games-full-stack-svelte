import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('GuessWordGuess', (table) => {
		table.increments('Id').primary();
		table
			.integer('GuessWordId')
			.unsigned()
			.notNullable()
			.references('Id')
			.inTable('GuessWord')
			.onDelete('CASCADE')
			.index();
		table.string('Guess', 25).notNullable();
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('GuessWordGuess');
}
