import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Video from '#models/video'
import Article from '#models/article'
import Audio from '#models/audio'
import Thumbnail from '#models/thumbnail'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Archive extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fileName: string

  @column()
  declare filePath: string

  @column()
  declare fileType: string

  @column()
  declare fileSize: number

  @column()
  declare createdAt: number

  @column()
  declare updatedAt: number

  @hasOne(() => Video)
  declare video: HasOne<typeof Video>

  @hasOne(() => Article)
  declare article: HasOne<typeof Article>

  @hasOne(() => Audio)
  declare audio: HasOne<typeof Audio>

  @hasOne(() => Thumbnail)
  declare thumbnail: HasOne<typeof Thumbnail>
}
