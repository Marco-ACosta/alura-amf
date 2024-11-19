import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Content from '#models/content'
import Playlist from '#models/playlist'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ContentPlaylist extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare contentId: string

  @column()
  declare playlistId: string

  @column()
  declare order: number

  @belongsTo(() => Content)
  declare content: BelongsTo<typeof Content>

  @belongsTo(() => Playlist)
  declare playlist: BelongsTo<typeof Playlist>
}
