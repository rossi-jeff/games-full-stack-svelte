import type { Knex } from 'knex';

enum Color {
	Black = 'Black',
	Blue = 'Blue',
	Brown = 'Brown',
	Green = 'Green',
	Orange = 'Orange',
	Purple = 'Purple',
	Red = 'Red',
	White = 'White',
	Yellow = 'Yellow'
}

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('CodeBreakerGuessColor', (table) => {
		table.increments('Id').primary();
		table
			.integer('CodeBreakerGuessId')
			.unsigned()
			.references('Id')
			.inTable('CodeBreakerGuess')
			.onDelete('CASCADE')
			.index();
		table.enum('Color', Object.values(Color)).notNullable();
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('CodeBreakerGuessColor');
}
