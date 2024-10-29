import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'watch_lists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('students_id')
        .notNullable()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
        .unsigned()
      table.string('name').notNullable()
      table.string('description').nullable()
      table.string('slug').notNullable()
      table.boolean('is_public').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
