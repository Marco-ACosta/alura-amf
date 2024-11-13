import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Video from '#models/video'
import Article from '#models/article'
import Audio from '#models/audio'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Content extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare type: string

  @column()
  declare title: string

  @column()
  declare isActive: boolean

  @column()
  declare releaseDate: number

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
}
