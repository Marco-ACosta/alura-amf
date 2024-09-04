import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classes_students'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table
        .uuid('class_id')
        .notNullable()
        .references('id')
        .inTable('classes')
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
