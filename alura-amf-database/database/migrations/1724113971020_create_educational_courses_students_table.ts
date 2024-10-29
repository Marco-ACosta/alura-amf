import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'educational_courses_students'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('educational_course_id')
        .notNullable()
        .references('id')
        .inTable('educational_courses')
        .onDelete('CASCADE')
        .unsigned()

      table
        .uuid('student_id')
        .notNullable()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
        .unsigned()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
