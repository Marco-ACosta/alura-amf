import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'thumbnails'

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
        .uuid('content_id')
        .references('id')
        .inTable('contents')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table.string('format').notNullable()
      table.integer('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
