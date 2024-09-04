import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('tag_id')
        .references('id')
        .inTable('tags')
        .onDelete('CASCADE')
        .unsigned()
        .notNullable()
      table
        .uuid('post_id')
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')
        .unsigned()
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
