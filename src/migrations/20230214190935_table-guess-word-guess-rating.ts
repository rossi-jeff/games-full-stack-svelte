import type { Knex } from 'knex';

enum Rating {
	Brown = 'Brown',
	Gray = 'Gray',
	Green = 'Green'
}

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('GuessWordGuessRating', (table) => {
		table.increments('Id').primary();
		table
			.integer('GuessWordGuessId')
			.unsigned()
			.notNullable()
			.references('Id')
			.inTable('GuessWordGuess')
			.onDelete('CASCADE')
			.index();
		table.enum('Rating', Object.values(Rating)).notNullable();
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('GuessWordGuessRating');
}
