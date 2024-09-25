import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'graduations'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('color').notNullable()
      table.string('description').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('color')
      table.dropColumn('description')
    })
  }
}
