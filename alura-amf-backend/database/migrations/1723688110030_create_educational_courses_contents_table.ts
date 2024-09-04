import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'educational_courses_contents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('educational_course_id')
        .notNullable()
        .references('id')
        .inTable('educational_courses')
        .onDelete('CASCADE')
      table
        .uuid('content_id')
        .notNullable()
        .references('id')
        .inTable('contents')
        .onDelete('CASCADE')
      table.integer('position').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
