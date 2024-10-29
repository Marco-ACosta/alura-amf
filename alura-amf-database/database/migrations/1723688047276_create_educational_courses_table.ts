import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'educational_courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.string('description').nullable()
      table.integer('deleted_at')
      table.integer('created_at').notNullable()
      table.boolean('is_active').defaultTo(true)
      table.integer('release_date')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
