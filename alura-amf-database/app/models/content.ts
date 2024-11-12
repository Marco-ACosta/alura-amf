import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
