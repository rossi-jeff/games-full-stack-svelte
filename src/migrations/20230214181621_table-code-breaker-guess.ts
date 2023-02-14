import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('CodeBreakerGuess', (table) => {
		table.increments('Id').primary();
		table
			.integer('CodeBreakerId')
			.unsigned()
			.notNullable()
			.references('Id')
			.inTable('CodeBreaker')
			.onDelete('CASCADE')
			.index();
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('CodeBreakerGuess');
}
