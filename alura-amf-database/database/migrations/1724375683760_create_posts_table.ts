import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('profile_id')
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table
        .uuid('forum_id')
        .references('id')
        .inTable('forums')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table.string('title').notNullable()
      table.string('body').notNullable()
      table.integer('created_at')
      table.boolean('is_resolved').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
