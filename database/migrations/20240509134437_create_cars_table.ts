import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('cars', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid()); 
        table.string('plate', 255).notNullable();
        table.string('manufacture', 255).notNullable();
        table.string('model', 255).notNullable();
        table.string('image').notNullable();
        table.integer('rentPerDay').notNullable();
        table.integer('capacity').notNullable();
        table.text('description').notNullable();
        table.string('transmission', 255).notNullable();
        table.string('type', 255).notNullable();
        table.integer('year').notNullable();
        table.specificType('options', 'text ARRAY').notNullable();
        table.specificType('specs', 'text ARRAY').notNullable();
        table.timestamp('availableAt').notNullable();
        table.boolean('available').notNullable();
        table.string('created_by', 255);
        table.string('updated_by', 255); 
        table.string('deleted_by', 255); 
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('cars');
}

