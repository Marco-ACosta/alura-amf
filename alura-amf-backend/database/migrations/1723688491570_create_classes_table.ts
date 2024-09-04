import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('course_id')
        .references('id')
        .inTable('courses')
        .unsigned()
        .notNullable()
        .onDelete('CASCADE')
      table.integer('start_date').notNullable()
      table.integer('end_date').notNullable()
      table.integer('deleted_at')
      table.boolean('is_active').defaultTo(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
