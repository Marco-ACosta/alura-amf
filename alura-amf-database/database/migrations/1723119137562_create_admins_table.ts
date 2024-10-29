import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('profile_id')
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table.string('cpf').notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
