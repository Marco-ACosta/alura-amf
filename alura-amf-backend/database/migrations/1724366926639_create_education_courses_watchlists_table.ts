import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'education_courses_watchlists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('education_course_id')
        .references('id')
        .inTable('educational_courses')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table
        .uuid('watch_list_id')
        .references('id')
        .inTable('watch_lists')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table.integer('order').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
