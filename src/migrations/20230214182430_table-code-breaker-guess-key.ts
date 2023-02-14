import type { Knex } from 'knex';

enum Key {
	Black = 'Black',
	White = 'White'
}

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('CodeBreakerGuessKey', (table) => {
		table.increments('Id').primary();
		table
			.integer('CodeBreakerGuessId')
			.unsigned()
			.references('Id')
			.inTable('CodeBreakerGuess')
			.onDelete('CASCADE')
			.index();
		table.enum('Key', Object.values(Key)).notNullable();
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('CodeBreakerGuessKey');
}
