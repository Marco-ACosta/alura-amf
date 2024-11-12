import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Thumbnail extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare archiveId: string

  @column()
  declare contentId: string

  @column()
  declare deletedAt: number

  @column()
  declare format: string
}
