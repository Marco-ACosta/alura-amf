import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Audio extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare archiveId: string

  @column()
  declare contentId: string

  @column()
  declare deletedAt: number | null

  @column()
  declare description: string

  @column()
  declare duration: number
}
