import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('comment').notNullable()
      table
        .uuid('profile_id')
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table
        .uuid('post_id')
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      table
        .uuid('parent_id')
        .references('id')
        .inTable('comments')
        .onDelete('CASCADE')
        .unsigned()
        .nullable()
      table.integer('created_at').notNullable()
      table.boolean('is_best_answer').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
