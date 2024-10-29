import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'graduations_courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('course_id')
        .references('id')
        .inTable('courses')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table
        .uuid('graduation_id')
        .references('id')
        .inTable('graduations')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
