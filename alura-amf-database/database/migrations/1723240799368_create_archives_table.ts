import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'archives'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('file_name').notNullable()
      table.string('file_path').notNullable()
      table.string('file_type').notNullable()
      table.integer('file_size').notNullable()
      table.integer('created_at')
      table.integer('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
