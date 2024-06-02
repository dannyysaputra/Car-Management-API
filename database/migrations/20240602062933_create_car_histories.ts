import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('car_histories', function(table) {
        table.increments('id').primary();
        table.uuid('car_id').references('id').inTable('cars').onDelete('CASCADE');
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('action'); // 'created', 'updated', 'deleted'
        table.timestamp('timestamp').defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('car_histories');
}

