import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').index().references('id').inTable('users')
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.dateTime('datetime').notNullable()
    table.boolean('in_diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
