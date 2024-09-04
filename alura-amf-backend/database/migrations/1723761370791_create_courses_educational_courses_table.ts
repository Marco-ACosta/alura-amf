import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'courses_educational_courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('course_id')
        .references('id')
        .inTable('courses')
        .onDelete('CASCADE')
        .unsigned()
        .notNullable()
      table
        .uuid('educational_course_id')
        .references('id')
        .inTable('educational_courses')
        .onDelete('CASCADE')
        .unsigned()
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
