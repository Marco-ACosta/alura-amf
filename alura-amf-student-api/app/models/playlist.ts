import { BaseModel, belongsTo, column, hasMany, hasManyThrough } from '@adonisjs/lucid/orm'
import Student from '#models/student'
import type { BelongsTo, HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import Content from '#models/content'
import ContentPlaylist from '#models/content_playlist'

export default class Playlist extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare isPublic: boolean

  @column()
  declare studentsId: string

  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @hasManyThrough([() => Content, () => ContentPlaylist], {
    throughForeignKey: 'id',
    throughLocalKey: 'contentId',
  })
  declare contents: HasManyThrough<typeof Content>

  @hasMany(() => ContentPlaylist)
  declare contentPlaylists: HasMany<typeof ContentPlaylist>
}
