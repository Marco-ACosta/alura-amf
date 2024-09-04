import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'content_playlists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('content_id')
        .references('id')
        .inTable('contents')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table
        .uuid('playlist_id')
        .references('id')
        .inTable('playlists')
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
