import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Graduation from '#models/graduation'
import Archive from '#models/archive'

export default class Icon extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare archiveId: string

  @column()
  declare graduationId: string

  @belongsTo(() => Graduation)
  declare graduation: BelongsTo<typeof Graduation>

  @belongsTo(() => Archive)
  declare archive: BelongsTo<typeof Archive>
}
