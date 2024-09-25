import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'icons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('archive_id')
        .references('id')
        .inTable('archives')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table
        .uuid('graduation_id')
        .references('id')
        .inTable('graduations')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
