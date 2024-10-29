import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'graduations_professors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .uuid('graduation_id')
        .notNullable()
        .references('id')
        .inTable('graduations')
        .onDelete('CASCADE')
        .unsigned()
      table
        .uuid('professor_id')
        .notNullable()
        .references('id')
        .inTable('professors')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .unsigned()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}