import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audio'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('archive_id')
        .notNullable()
        .references('id')
        .inTable('archives')
        .onDelete('CASCADE')
      table
        .uuid('content_id')
        .notNullable()
        .references('id')
        .inTable('contents')
        .onDelete('CASCADE')
      table.string('description').notNullable()
      table.integer('duration').notNullable()
      table.integer('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
