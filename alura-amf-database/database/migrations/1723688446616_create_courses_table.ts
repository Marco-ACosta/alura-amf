import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('name').notNullable().unique()
      table.string('slug').notNullable().unique()
      table.string('description').nullable()
      table.boolean('is_active').defaultTo(true)
      table.integer('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
