import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid()); 
        table.string('name', 255).notNullable();
        table.string('email', 255).notNullable();
        table.string('password', 255).notNullable();
        table.text('avatar');
        table.string('role', 255).notNullable().defaultTo('user');
        table.string('created_by', 255);
        table.string('updated_by', 255);    
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}

