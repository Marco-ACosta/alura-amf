import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Content from '#models/content'
import Archive from '#models/archive'

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

  @belongsTo(() => Content)
  declare content: BelongsTo<typeof Content>

  @belongsTo(() => Archive)
  declare archive: BelongsTo<typeof Archive>
}
