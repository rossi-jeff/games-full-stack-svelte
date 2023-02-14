import type { Knex } from 'knex';

// import failed
enum GameStatus {
	Playing = 'Playing',
	Won = 'Won',
	Lost = 'Lost'
}

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('CodeBreaker', (table) => {
		table.increments('Id').primary();
		table
			.integer('UserId')
			.unsigned()
			.nullable()
			.references('Id')
			.inTable('User')
			.onDelete('CASCADE')
			.index();
		table.enum('Status', Object.values(GameStatus)).notNullable();
		table.integer('Columns').notNullable();
		table.integer('Colors').notNullable();
		table.integer('Score').notNullable().defaultTo(0);
		table.datetime('CreatedAt').notNullable();
		table.datetime('UpdatedAt').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('CodeBreaker');
}
