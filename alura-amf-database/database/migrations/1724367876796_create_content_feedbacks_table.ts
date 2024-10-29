import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'content_feedbacks'

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
      table
        .uuid('content_id')
        .references('id')
        .inTable('contents')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table.string('feedback').notNullable()
      table.integer('rating').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
