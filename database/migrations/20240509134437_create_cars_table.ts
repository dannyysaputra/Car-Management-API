import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('cars', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid()); 
        table.string('name', 255).notNullable();
        table.integer('price').notNullable();
        table.string('image').notNullable();
        table.string('created_by', 255);
        table.string('updated_by', 255); 
        table.string('deleted_by', 255); 
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('cars');
}

