import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'graduations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('name').unique().notNullable()
      table.string('slug').unique().notNullable()
      table.boolean('is_active').defaultTo(true)
      table.integer('created_at').notNullable()
      table.integer('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
